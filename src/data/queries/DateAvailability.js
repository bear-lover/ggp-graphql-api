import DateAvailabilityType from '../types/DateAvailabilityType';
import { ListBlockedDates } from '../../data/models';
import moment from 'moment';

import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
} from 'graphql';

const DateAvailability = {

  type: DateAvailabilityType,

  args: {
    listId: { type: new NonNull(IntType) },
    startDate: { type: new NonNull(StringType) },
    endDate: { type: new NonNull(StringType) },
  },

  async resolve({ request, response }, { listId, startDate, endDate }) {
    try {

      let convertStart = moment(startDate).format('YYYY-MM-DD');
      let convertEnd = moment(endDate).format('YYYY-MM-DD');

      const checkAvailableDates = await ListBlockedDates.findAll({
        where: {
          listId,
          blockedDates: {
            $between: [convertStart, convertEnd]
          }
        },
        raw: true
      });


      const isBlocked = checkAvailableDates && checkAvailableDates.length > 0 ? checkAvailableDates.filter(o => o.calendarStatus == "blocked") : [];

      const checkInSecondHalf = isBlocked && isBlocked.length > 0 && isBlocked.filter(o => moment(o.blockedDates).format('YYYY-MM-DD') == moment(startDate).format('YYYY-MM-DD') && o.dayStatus == 'firstHalf');
      const checkOutFirstHalf = isBlocked && isBlocked.length > 0 && isBlocked.filter(o => moment(o.blockedDates).format('YYYY-MM-DD') == moment(endDate).format('YYYY-MM-DD') && o.dayStatus == 'secondHalf');

      if (isBlocked.length > 0) {
        if (isBlocked.length == 2 && (checkInSecondHalf.length === 1 && checkOutFirstHalf.length === 1)) {
          return {
            status: "Available"
          }
        } else if (isBlocked.length == 1 && (checkInSecondHalf.length === 1 || checkOutFirstHalf.length === 1)) {
          return {
            status: "Available"
          }
        } else {
          return {
            status: "NotAvailable"
          }
        }

      } else {
        return {
          status: "Available"
        }
      }
    } catch (e) {
      return {
        status: "NotAvailable"
      }
    }


  },
};

export default DateAvailability;
