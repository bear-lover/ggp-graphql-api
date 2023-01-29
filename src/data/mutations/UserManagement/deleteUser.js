import DeleteUserType from '../../types/siteadmin/DeleteUserType';
import { User, UserLogin, UserClaim, Listing, DocumentVerification, Threads, Reviews, Reservation, ThreadItems } from '../../models';

import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const deleteUser = {

  type: DeleteUserType,

  args: {
    userId: { type: new NonNull(StringType) },
  },

  async resolve({ request }, { userId }) {

    if (request.user && request.user.admin == true) {

      const findActiveReservation = await Reservation.count({
        where: {
          paymentState: 'completed',
          reservationState: {
            $in: ['pending', 'approved']
          },
          $or: [{
            hostId: userId,
          }, {
            guestId: userId
          }]
        }
      });

      if (findActiveReservation > 0) {
        return {
          status: 400,
          errorMessage: 'Oops! Unable to delete this user. It seems the user is having active/upcoming bookings and they have to cancel or complete the bookings in order to delete them.'
        };
      }

      const updateUserStatus = await User.update({
        userDeletedAt: new Date()
      }, {
        where: {
          id: userId
        }
      });


      if (updateUserStatus) {

        await Reviews.destroy({
          where: {
            authorId: userId
          }
        });

        await Listing.destroy({
          where: {
            userId
          }
        });

        await DocumentVerification.destroy({
          where: {
            userId
          }
        });

        const findThreads = await Threads.findAll({
          attributes: ['id', 'host'],
          where: {
            $or: [
              {
                host: userId
              },
              {
                guest: userId
              }
            ]
          },
          raw: true
        });

        if (findThreads && findThreads.length > 0) {
          findThreads.map(async (item, key) => {
            const checkEnquiry = await ThreadItems.findOne({
              attributes: ['id', 'type', 'startDate', 'endDate', 'personCapacity'],
              where: {
                threadId: item.id,
              },
              limit: 1,
              order: [['createdAt', 'DESC']],
              raw: true
            });

            if (checkEnquiry && checkEnquiry.type == 'inquiry') {
              await ThreadItems.create({
                threadId: item.id,
                sentBy: userId,
                type: userId === item.host ? 'cancelledByHost' : 'cancelledByGuest',
                startDate: checkEnquiry.startDate,
                endDate: checkEnquiry.endDate,
                personCapacity: checkEnquiry.personCapacity
              });
            }
          });
        }

      }

      // Check Both Tables are deleted
      return {
        status: updateUserStatus ? 200 : 400,
        errorMessage: updateUserStatus ? null : 'Oops! Something went wrong! Please try again.'
      };

    } else {
      return { status: 500, errorMessage: 'Please login and continue.' };
    }

  },
};

export default deleteUser;
