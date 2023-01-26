import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import moment from 'moment';

import {
    Reservation,
    Listing,
    Cancellation,
    Threads,
    UserProfile,
    User,
    CurrencyRates,
    Currencies
} from '../../models';

import CancellationResponseType from '../../types/CancellationResponseType';

import { convert } from '../../../helpers/currencyConvertion';
import { getDateRanges } from '../../../helpers/dateHelper';
import { cancelByGuest, cancelByHost, getPriceWithDiscount } from '../../../helpers/cancellationHelper';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const cancelReservationData = {

    type: CancellationResponseType,

    args: {
        reservationId: { type: new NonNull(IntType) },
        userType: { type: new NonNull(StringType) },
        currency: { type: StringType },
    },

    async resolve({ request }, { reservationId, currency, userType }) {
        try {
            if (!request.user || !request.user.id) {
                return {
                    status: 500,
                    errorMessage: 'Please login with your account and try again.',
                };
            }

            const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
            if (userStatusErrorMessage) {
                return {
                    status: userStatusError,
                    errorMessage: userStatusErrorMessage
                };
            }

            let amountCalculated = {};

            const cancellationData = await Reservation.findOne({
                where: {
                    id: reservationId,
                    $or: [{ reservationState: 'pending' }, { reservationState: 'approved' }],
                    checkOut: { $gte: new Date() },
                    [userType === 'host' ? 'hostId' : 'guestId']: request.user.id
                },
                attributes: ['id', 'listId', 'basePrice', 'cleaningPrice', 'currency', 'discount', 'guestServiceFee', 'hostServiceFee', 'total', 'confirmationCode', 'cancellationPolicy', 'isSpecialPriceAverage', 'hostServiceFeeType', 'hostServiceFeeValue', 'hostId', 'guestId', 'checkIn', 'checkOut', 'guests'],
                raw: true
            });

            if (!cancellationData || !cancellationData.checkIn || !cancellationData.checkOut || !cancellationData.listId) {
                return {
                    status: 400,
                    errorMessage: "Something went wrong!."
                };
            }

            const hostDetails = await User.findOne({
                attributes: ['email'],
                where: { id: cancellationData.hostId },
                include: [{
                    model: UserProfile, as: 'profile',
                    attributes: ['firstName', 'picture']
                }],
                raw: true
            });

            const guestDetails = await User.findOne({
                attributes: ['email'],
                where: { id: cancellationData.guestId },
                include: [{
                    model: UserProfile, as: 'profile',
                    attributes: ['firstName', 'picture']
                }],
                raw: true
            });

            const threadData = await Threads.findOne({
                attributes: ['id'],
                where: {
                    listId: cancellationData.listId,
                    $and: [
                        { host: cancellationData.hostId },
                        { guest: cancellationData.guestId }
                    ]
                },
                raw: true
            });

            const listData = await Listing.findOne({
                where: { id: cancellationData.listId },
                attributes: ['id', 'title', 'country'],
                raw: true
            });

            const policyData = await Cancellation.findOne({
                where: { id: cancellationData.cancellationPolicy },
                raw: true
            });

            if (!listData || !listData.id || !policyData || !policyData.id) {
                return {
                    status: 400,
                    errorMessage: (!listData || !listData.id) ? "Listing not found" : "Policy not found"
                };
            }

            const { nights, interval } = getDateRanges({ checkIn: cancellationData.checkIn, checkOut: cancellationData.checkOut, country: listData && listData.country });

            if ((-interval) >= (nights - 1)) { //Block if the (current date) is equal or greater than the (one day before checkout date)
                return {
                    status: 400,
                    errorMessage: "This reservation can't be cancelled."
                };
            }

            if (userType === 'guest') {
                amountCalculated = cancelByGuest({
                    policyData,
                    interval,
                    nights,
                    cleaningPrice: cancellationData.cleaningPrice || 0,
                    guestServiceFee: cancellationData.guestServiceFee,
                    hostServiceFee: cancellationData.hostServiceFee,
                    total: cancellationData.total,
                    hostServiceFeeType: cancellationData.hostServiceFeeType,
                    hostServiceFeeValue: cancellationData.hostServiceFeeValue,
                    basePrice: getPriceWithDiscount({
                        discount: cancellationData.discount,
                        nights,
                        basePrice: cancellationData.isSpecialPriceAverage || cancellationData.basePrice
                    })
                });
            }
            else {
                amountCalculated = cancelByHost({
                    interval,
                    nights,
                    remainingNights: interval <= 0 && (nights - 1) + interval, //Host cancelled 'During' period
                    total: cancellationData.total,
                    cleaningPrice: cancellationData.cleaningPrice || 0,
                    guestServiceFee: cancellationData.guestServiceFee,
                    hostServiceFee: cancellationData.hostServiceFee,
                    hostServiceFeeType: cancellationData.hostServiceFeeType,
                    hostServiceFeeValue: cancellationData.hostServiceFeeValue,
                    basePrice: getPriceWithDiscount({
                        discount: cancellationData.discount,
                        nights,
                        basePrice: cancellationData.isSpecialPriceAverage || cancellationData.basePrice
                    })
                });
            }

            amountCalculated = {
                ...amountCalculated,
                isSpecialPriceAverage: cancellationData.isSpecialPriceAverage,
                total: cancellationData.total + cancellationData.guestServiceFee,
            };

            if (currency != cancellationData.currency) { //Currency Convertion
                const data = await CurrencyRates.findAll();
                const base = await Currencies.findOne({ where: { isBaseCurrency: true } });

                let rates = {};
                if (data) data.map((item) => rates[item.dataValues.currencyCode] = item.dataValues.rate);

                Object.keys(amountCalculated).map(item => {
                    amountCalculated[item] = (convert(base.symbol, rates, amountCalculated[item], cancellationData.currency, currency)).toFixed(2);
                });
            }

            return {
                status: 200,
                results: {
                    ...amountCalculated,
                    cancelledBy: userType,
                    hostEmail: userType === 'guest' ? hostDetails.email : '',
                    guestEmail: userType === 'host' ? guestDetails.email : '',
                    reservationId: reservationId,
                    cancellationPolicy: policyData.policyName,
                    startedIn: interval,
                    stayingFor: nights,
                    listId: cancellationData.listId,
                    currency,
                    threadId: threadData && threadData.id,
                    checkIn: moment(moment(cancellationData.checkIn)).format('YYYY-MM-DD'),
                    checkOut: moment(moment(cancellationData.checkOut)).format('YYYY-MM-DD'),
                    guests: cancellationData.guests,
                    listTitle: listData.title,
                    hostName: hostDetails && hostDetails['profile.firstName'],
                    guestName: guestDetails && guestDetails['profile.firstName'],
                    hostProfilePicture: hostDetails && hostDetails['profile.picture'],
                    guestProfilePicture: guestDetails && guestDetails['profile.picture'],
                    confirmationCode: cancellationData.confirmationCode
                }
            };

        } catch (error) {
            return {
                errorMessage: 'Something went wrong! ' + error,
                status: 400
            }
        }

    }
};

export default cancelReservationData;
