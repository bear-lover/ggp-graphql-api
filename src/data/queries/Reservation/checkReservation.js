import ReservationType from '../../types/ReservationType';
import { ListBlockedDates } from '../../models';
import moment from 'moment';

import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
import sequelize from '../../sequelize';

const checkReservation = {

    type: ReservationType,

    args: {
        checkIn: { type: StringType },
        checkOut: { type: StringType },
        listId: { type: IntType }
    },

    async resolve({ request }, { checkIn, checkOut, listId }) {
        if (request.user) {
            const getDaysBetweenDates = function (startDate, endDate) {
                startDate.add(1, 'days');
                endDate.subtract(1, 'days');
                var now = startDate.clone(), dates = [];

                while (now.isSameOrBefore(endDate)) {
                    dates.push(now.format('YYYY-MM-DD'));
                    now.add(1, 'days');
                }
                return dates;
            };

            checkIn = moment(checkIn), checkOut = moment(checkOut);
            let checkInFormat = moment(checkIn).format('YYYY-MM-DD')
            let checkOutFormat = moment(checkOut).format('YYYY-MM-DD');
            const datearray = getDaysBetweenDates(checkIn, checkOut);
            let fullBlockedDates = datearray.filter(date => date && date.trim()).map(a => "'" + a + "'").join();
            let isDateAvailable = datearray && datearray.length > 0;

            const result = await ListBlockedDates.findOne({
                where: {
                    id: {
                        $in: [
                            sequelize.literal(`select listId from ListBlockedDates where listid=${listId} and calendarStatus!='available' and (${isDateAvailable ? `(DATE(blockedDates) in (${fullBlockedDates}) and dayStatus IN ('full', 'secondHalf', 'firstHalf')) or` : ''} (DATE(blockedDates) in ('${checkInFormat}') and dayStatus in ('secondHalf', 'full')) or (DATE(blockedDates) in ('${checkOutFormat}') and dayStatus in ('firstHalf', 'full')))`)
                        ]
                    }
                },
                raw: true
            })
            return {
                status: result ? "400" : "200"
            };
        } else {
            return {
                status: "notLoggedIn",
            };
        }
    }
};

export default checkReservation;