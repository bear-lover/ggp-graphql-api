// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLFloat as FloatType,
} from 'graphql';
import { url } from '../../../config';
import { convert } from '../../../helpers/currencyConvertion';
import fetch from 'node-fetch';
import ReservationPaymentType from '../../types/ReservationPaymentType';

// Sequelize models
import { Reservation, ListingData, Listing, User, CurrencyRates, Currencies, ReservationSpecialPricing, ListBlockedDates } from '../../models';
import { createCustomer, createStripePayment } from '../../../libs/payment/stripe/helpers/stripe';
import { createPayPalPayment } from '../../../libs/payment/paypal/createPayPalPayment';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';
const createReservation = {

  type: ReservationPaymentType,

  args: {
    listId: { type: new NonNull(IntType) },
    checkIn: { type: new NonNull(StringType) },
    checkOut: { type: new NonNull(StringType) },
    guests: { type: new NonNull(IntType) },
    message: { type: new NonNull(StringType) },
    basePrice: { type: new NonNull(FloatType) },
    cleaningPrice: { type: FloatType },
    currency: { type: new NonNull(StringType) },
    discount: { type: FloatType },
    discountType: { type: StringType },
    guestServiceFee: { type: FloatType },
    hostServiceFee: { type: FloatType },
    total: { type: new NonNull(FloatType) },
    bookingType: { type: StringType },
    paymentType: { type: IntType },
    cardToken: { type: StringType },
    convCurrency: { type: new NonNull(StringType) },
    specialPricing: { type: StringType },
    averagePrice: { type: FloatType },
    nights: { type: IntType },
    paymentCurrency: { type: StringType },
  },

  async resolve({ request, res }, {
    listId,
    checkIn,
    checkOut,
    guests,
    message,
    basePrice,
    cleaningPrice,
    currency,
    discount,
    discountType,
    guestServiceFee,
    hostServiceFee,
    total,
    bookingType,
    paymentType,
    cardToken,
    convCurrency,
    specialPricing,
    averagePrice,
    nights,
    paymentCurrency
  }) {

    try {

      // Check if user already logged in

      if (request.user && !request.user.admin) {

        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }

        let userId = request.user.id;
        let userBanStatus;
        let isValidTotal = false, reservationId, amount;
        let status = 200, errorMessage;
        let confirmationCode = Math.floor(100000 + Math.random() * 900000);
        let reservationState, rates, ratesData = {}, hostId, id, reservation, totalWithoutGuestFee = 0;
        let totalConverted = 0, totalWithoutGuestFeeConverted = 0, cleaningPriceConverted = 0, discountConverted = 0, guestServiceFeeConverted = 0, hostServiceFeeConverted = 0;
        let convertSpecialPricing = [], averagePriceConverted = 0, specialPriceCollection = [];
        let listingBaseprice = 0, listingCleaningPrice = 0, hostServiceFeeType = '', hostServiceFeeValue = 0;
        let isSpecialPriceAssigned = false;
        let customerId, customerEmail, paymentIntentSecret, requireAdditionalAction = false, redirectUrl;

        if (bookingType === 'instant') {
          reservationState = 'approved';
        }

        const userData = await User.findOne({
          attributes: [
            'userBanStatus'
          ],
          where: { id: request.user.id },
          raw: true
        })

        if (userData) {
          if (userData.userBanStatus === 1) {
            return {
              errorMessage: 'Your account has blocked for some reason and please contact our support team.',
              status: 500
            }
          }
          else {
            userBanStatus = false;
          }
        }

        const listData = await Listing.findOne({
          attributes: ['userId', 'title'],
          where: {
            id: listId
          },
          raw: true
        });

        hostId = listData.userId;

        const listingData = await ListingData.findOne({
          attributes: ['basePrice', 'cleaningPrice', 'currency', 'cancellationPolicy', 'checkInStart', 'checkInEnd'],
          where: {
            listId
          },
          raw: true
        });

        const data = await CurrencyRates.findAll();
        const base = await Currencies.findOne({ where: { isBaseCurrency: true } });
        if (data) {
          data.map((item) => {
            ratesData[item.dataValues.currencyCode] = item.dataValues.rate;
          })
        }
        rates = ratesData;

        if (listingData) {
          listingBaseprice = listingData.basePrice;
          listingCleaningPrice = listingData.cleaningPrice;
        }

        cleaningPriceConverted = convert(base.symbol, rates, cleaningPrice, currency, listingData.currency);
        discountConverted = convert(base.symbol, rates, discount, currency, listingData.currency);
        guestServiceFeeConverted = convert(base.symbol, rates, guestServiceFee, currency, listingData.currency);
        hostServiceFeeConverted = convert(base.symbol, rates, hostServiceFee, currency, listingData.currency);
        totalConverted = convert(base.symbol, rates, total, currency, listingData.currency);
        if (currency != listingData.currency) {
          averagePriceConverted = convert(base.symbol, rates, averagePrice, currency, listingData.currency);
        } else {
          averagePriceConverted = averagePrice;
        }

        let query = `query getBillingCalculation($listId: Int!, $startDate: String!, $endDate: String!, $guests: Int!, $convertCurrency: String!) {
        getBillingCalculation(listId: $listId, startDate: $startDate, endDate: $endDate, guests: $guests, convertCurrency: $convertCurrency) {
          result {
            checkIn
            checkOut
            nights
            basePrice
            cleaningPrice
            guests
            currency
            guestServiceFeePercentage
            hostServiceFeePercentage
            weeklyDiscountPercentage
            monthlyDiscountPercentage
            guestServiceFee
            hostServiceFee
            discountLabel
            discount
            subtotal
            total
            averagePrice
            priceForDays
            specialPricing{
              blockedDates
              isSpecialPrice
            }
            isSpecialPriceAssigned
            hostServiceFeeType,
            hostServiceFeeValue,
          }
          status
          errorMessage
        }
      }
      `;

        let variables = {
          listId,
          startDate: checkIn,
          endDate: checkOut,
          guests,
          convertCurrency: currency
        }

        const response = await new Promise((resolve, reject) => {
          fetch(url + '/graphql', {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, variables }),
            method: 'post',
          }).then(res => res.json())
            .then(function (body) {
              if (body) {
                resolve(body)
              } else {
                reject(error)
              }
            });
        });

        if (response && response.data && response.data.getBillingCalculation && response.data.getBillingCalculation.result) {
          specialPricing = response.data.getBillingCalculation.result.specialPricing;
          isSpecialPriceAssigned = response.data.getBillingCalculation.result.isSpecialPriceAssigned;
          hostServiceFeeType = response.data.getBillingCalculation.result.hostServiceFeeType;
          hostServiceFeeValue = response.data.getBillingCalculation.result.hostServiceFeeValue;
          if (isSpecialPriceAssigned) {
            convertSpecialPricing = specialPricing;
          }
          if (total === response.data.getBillingCalculation.result.total) {
            isValidTotal = true;
          } else {
            return {
              errorMessage: response.data.getBillingCalculation.errorMessage,
              status: 400
            };
          }
        }

        if (isValidTotal) {

          totalWithoutGuestFeeConverted = totalConverted - guestServiceFeeConverted;
          amount = totalConverted;
          if (paymentType === 2 && status === 200) {
            //  create customer in stripe
            const stripeCustomerData = await createCustomer(userId);
            status = stripeCustomerData.status;
            errorMessage = stripeCustomerData.errorMessage;
            customerId = stripeCustomerData.customerId;
            customerEmail = stripeCustomerData.customerEmail;
          }
          // // If there is no error, the  proceed with charging
          if (status === 200) {
            reservation = await Reservation.create({
              listId,
              hostId,
              guestId: userId,
              checkIn,
              checkOut,
              guests,
              message,
              basePrice: listingBaseprice,
              cleaningPrice: listingCleaningPrice,
              currency: listingData.currency,
              discount: discountConverted && discountConverted.toFixed(2),
              discountType,
              guestServiceFee: guestServiceFeeConverted && guestServiceFeeConverted.toFixed(2),
              hostServiceFee: hostServiceFeeConverted && hostServiceFeeConverted.toFixed(2),
              total: totalWithoutGuestFeeConverted && totalWithoutGuestFeeConverted.toFixed(2),
              confirmationCode,
              reservationState,
              paymentMethodId: paymentType,
              cancellationPolicy: listingData && listingData.cancellationPolicy,
              isSpecialPriceAverage: averagePriceConverted && averagePriceConverted.toFixed(2),
              dayDifference: nights,
              checkInStart: listingData.checkInStart,
              checkInEnd: listingData.checkInEnd,
              hostServiceFeeType,
              hostServiceFeeValue,
            });

            reservationId = reservation.dataValues.id;

            if (reservation && isSpecialPriceAssigned) {
              if (convertSpecialPricing && convertSpecialPricing.length > 0) {
                convertSpecialPricing.map(async (item, key) => {
                  let convertDate = new Date(parseInt(item.blockedDates));

                  let blockedDatesInstance = {
                    listId,
                    reservationId: reservationId,
                    blockedDates: convertDate,
                    isSpecialPrice: item.isSpecialPrice
                  };

                  specialPriceCollection.push(blockedDatesInstance);
                });

                // Do the bulk insert for the special pricing dates
                const bulkCreate = await ReservationSpecialPricing.bulkCreate(specialPriceCollection);
              }
            }
          }

          if (paymentType === 2) {
            //  Create stripe paymentIntents
            const stripePaymentData = await createStripePayment(cardToken, amount, listingData.currency, customerId, customerEmail, reservationId, listId, listData.title);
            status = stripePaymentData.status;
            errorMessage = stripePaymentData.errorMessage;
            requireAdditionalAction = stripePaymentData.requireAdditionalAction;
            paymentIntentSecret = stripePaymentData.paymentIntentSecret;
          } else {
            //  Create paypal payment
            await createPayPalPayment(listData.title, reservationId, amount, paymentCurrency)
              .then(res => {
                if (res.payer.payment_method === 'paypal') {
                  for (var i = 0; i < res.links.length; i++) {
                    var link = res.links[i];
                    if (link.method === 'REDIRECT') {
                      redirectUrl = link.href;
                    }
                  }
                  status = 200;
                }
              })
              .catch((err) => {
                status = 400;
                errorMessage = 'Something went wrong ' + err.response && err.response.message;
              });
          }

          return await {
            results: reservation,
            status,
            errorMessage,
            requireAdditionalAction,
            paymentIntentSecret,
            reservationId,
            redirectUrl
          }

        } else {
          return await {
            errorMessage: response.data.getBillingCalculation.errorMessage,
            status: response.data.getBillingCalculation.status
          }
        }
      } else {
        return {
          status: 500,
          errorMessage: 'Please login with your account and try again.'
        }
      }

    } catch (error) {
      return {
        errorMessage: 'Something went wrong ' + error,
        status: 400
      };
    }
  },
};

export default createReservation;
