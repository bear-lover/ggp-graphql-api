import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import { Threads, ThreadItems, User } from '../../models';
import UnReadCountType from '../../types/UnReadCountType';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const getUnReadCount = {

  type: UnReadCountType,

  async resolve({ request }) {

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

        let userBanStatus;
        // For Host
        const hostCount = await Threads.count({
          where: {
            host: request.user.id
          },
          include: [{
            model: ThreadItems,
            as: 'threadItems',
            require: true,
            where: {
              sentBy: {
                $ne: request.user.id
              },
              isRead: false
            },
            order: [['isRead', 'ASC']]
          }]
        });

        // For Travelling
        const guestCount = await Threads.count({
          where: {
            guest: request.user.id
          },
          include: [{
            model: ThreadItems,
            as: 'threadItems',
            require: true,
            where: {
              sentBy: {
                $ne: request.user.id
              },
              isRead: false
            },
            order: [['isRead', 'ASC']]
          }]
        });

        let total = hostCount + guestCount;

        const userData = await User.findOne({
          attributes: [
            'userBanStatus',
            'userDeletedAt'
          ],
          where: { id: request.user.id }
        })
        if (userData) {
          if (userData.userBanStatus == 1 || userData.userDeletedAt != null) {
            userBanStatus = true;
          }
          else {
            userBanStatus = false;
          }
        }

        return {
          status: 200,
          results: {
            hostCount: hostCount > 0 ? hostCount : 0,
            guestCount: guestCount > 0 ? guestCount : 0,
            total: total > 0 ? total : 0,
            userBanStatus
          }
        };

      } else {
        return {
          status: 500,
          errorMessage: 'Currently, Please login with your account and try again.',
        };
      }
    } catch (error) {
      return {
        errorMessage: 'Something went wrong' + error,
        status: 400
      };
    }
  }
};

export default getUnReadCount;
