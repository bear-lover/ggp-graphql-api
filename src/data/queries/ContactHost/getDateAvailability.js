import ContactHostAvailabilityType from '../../types/ContactHostAvailabilityType';
import { ListBlockedDates } from '../../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
} from 'graphql';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const getDateAvailability = {

  type: ContactHostAvailabilityType,

  args: {
    listId: { type: new NonNull(IntType) },
    startDate: { type: new NonNull(StringType) },
    endDate: { type: new NonNull(StringType) },
  },

  async resolve({ request, response }, { listId, startDate, endDate }) {
    try {

      if (request && request.user) {
        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }
      }

      const checkAvailableDates = await ListBlockedDates.findAll({
        where: {
          listId,
          blockedDates: {
            $between: [startDate, endDate]
          }
        }
      });

      let isBlocked = checkAvailableDates && checkAvailableDates.length > 0 ? checkAvailableDates.filter(
        (o, i) => {
          if (o.calendarStatus == "blocked" && (o.dayStatus === 'secondHalf' || o.dayStatus === 'full') &&
            o.blockedDates === startDate) return true;
          if (o.calendarStatus == "blocked" && (o.dayStatus === 'firstHalf' || o.dayStatus === 'full') &&
            o.blockedDates === endDate) return true;
          if (o.calendarStatus == "blocked" && o.blockedDates !== startDate &&
            o.blockedDates !== endDate) return true;
          return false
        }
      ) : [];
      
      if (isBlocked.length > 0) {

        return {
          status: "NotAvailable"
        }
      } else {
        return {
          status: "Available"
        }
      }
    } catch (error) {
      return {
        errorMessage: 'Something went wrong' + error,
        status: 400
      };
    }


  },
};

export default getDateAvailability;
