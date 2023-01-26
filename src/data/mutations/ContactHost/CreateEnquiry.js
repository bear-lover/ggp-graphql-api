// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import ThreadItemsType from '../../types/ThreadItemsType';

// Sequelize models
import { Threads, ThreadItems, ListBlockedDates, UserProfile, User } from '../../../data/models';
import moment from 'moment';
import { sendEmail } from '../../../libs/sendEmail';
import EnquiryType from '../../types/EnquiryType';
import { sendNotifications } from '../../../helpers/sendNotifications';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const CreateEnquiry = {

  type: EnquiryType,

  args: {
    listId: { type: new NonNull(IntType) },
    hostId: { type: new NonNull(StringType) },
    content: { type: new NonNull(StringType) },
    userId: { type: new NonNull(StringType) },
    type: { type: StringType },
    startDate: { type: new NonNull(StringType) },
    endDate: { type: new NonNull(StringType) },
    personCapacity: { type: IntType },
  },

  async resolve({ request, response }, {
    listId,
    hostId,
    content,
    userId,
    type,
    startDate,
    endDate,
    personCapacity
  }) {

    try {

      // Check if user already logged in
      if (request.user) {

        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }

        const checkAvailableDates = await ListBlockedDates.findAll({
          where: {
            listId,
            blockedDates: {
              $between: [moment.utc(startDate, 'MM-DD-YYYY').format('YYYY-MM-DD'), moment.utc(endDate, 'MM-DD-YYYY').format('YYYY-MM-DD')]
            }
          }
        });

        let isBlocked = checkAvailableDates && checkAvailableDates.length > 0 ? checkAvailableDates.filter(
          (o, i) => {
            let blockedDate = moment.utc(o.blockedDates).format('MM-DD-YYYY');
            if (o.calendarStatus == "blocked" && (o.dayStatus === 'secondHalf' || o.dayStatus === 'full') &&
              blockedDate === startDate) return true;
            if (o.calendarStatus == "blocked" && (o.dayStatus === 'firstHalf' || o.dayStatus === 'full') &&
              blockedDate === endDate) return true;
            if (o.calendarStatus == "blocked" && blockedDate !== startDate &&
              blockedDate !== endDate) return true;
            return false
          }
        ) : [];

        let notifyUserId, notifyGuestId, notifyHostId, notifyUserType;
        let userName;

        if (isBlocked && isBlocked.length > 0) {
          return {
            status: 400,
            errorMessage: 'Something went wrong. Dates are not available'
          }
        } else {
          // Check if a thread is already there or create a new one
          const thread = await Threads.findOrCreate({
            where: {
              listId,
              host: hostId,
              guest: userId,
            },
            defaults: {
              //properties you want on create
              listId,
              host: hostId,
              guest: userId,
              messageUpdatedDate: new Date(),
            }
          });

          if (thread) {
            // Create a thread item
            const threadItems = await ThreadItems.create({
              threadId: thread[0].dataValues.id,
              sentBy: userId,
              content,
              type,
              startDate,
              endDate,
              personCapacity,
            });
            if (threadItems) {
              const updateThreads = await Threads.update({
                isRead: false,
                messageUpdatedDate: new Date()
              },
                {
                  where: {
                    id: thread[0].dataValues.id
                  }
                }
              );

              const getThread = await Threads.findOne({
                where: {
                  id: thread[0].dataValues.id
                },
                raw: true
              });

              if (getThread && getThread.host && getThread.guest) {
                notifyUserId = getThread.host === userId ? getThread.guest : getThread.host;
                notifyUserType = getThread.host === userId ? 'guest' : 'host';
                notifyGuestId = getThread.host === userId ? getThread.guest : getThread.host;
                notifyHostId = getThread.host === userId ? getThread.host : getThread.guest;
              }

              const hostProfile = await UserProfile.findOne({
                where: {
                  userId: hostId
                }
              });

              const hostEmailDetail = await User.findOne({
                where: {
                  id: hostId
                },
                raw: true
              });

              const guestProfile = await UserProfile.findOne({
                where: {
                  userId
                }
              });


              if (guestProfile && getThread) {
                userName = guestProfile.firstName;
              }

              let emailContent = {
                receiverName: hostProfile.dataValues.firstName,
                senderName: guestProfile.dataValues.firstName,
                type: 'host',
                message: content,
                threadId: thread[0].dataValues.id,
                checkIn: startDate,
                checkOut: endDate,
                personCapacity
              };

              let notifyContent = {
                "screenType": "message",
                "userType": notifyUserType.toString(),
                "threadId": (thread[0].dataValues.id).toString(),
                "guestId": notifyGuestId.toString(),
                "guestName": guestProfile && ((guestProfile.displayName).toString()),
                "guestPicture": (guestProfile && guestProfile.picture) ? ((guestProfile.picture).toString()) : '',
                "hostId": notifyHostId.toString(),
                "hostName": hostProfile && ((hostProfile.displayName).toString()),
                "hostPicture": (hostProfile && hostProfile.picture) ? ((hostProfile.picture).toString()) : '',
                "guestProfileId": guestProfile && ((guestProfile.profileId).toString()),
                "hostProfileId": hostProfile && ((hostProfile.profileId).toString()),
                "listId": listId.toString(),
                "userName": userName,
                "content": content
              };


              sendNotifications('newEnquiry', notifyContent, notifyUserId);

              const { status, response } = sendEmail(hostEmailDetail.email, 'inquiry', emailContent);

              return {
                result: {
                  id: threadItems.dataValues.id,
                  sentBy: threadItems.dataValues.sentBy,
                  content: threadItems.dataValues.content,
                  type: threadItems.dataValues.type,
                  personCapacity: threadItems.dataValues.personCapacity,
                  startDate: moment(moment(threadItems.dataValues.startDate)).format('MM-DD-YYYY'),
                  endDate: moment(moment(threadItems.dataValues.endDate)).format('MM-DD-YYYY'),
                  createdAt: moment(moment(threadItems.dataValues.createdAt)).format('MM-DD-YYYY'),
                },
                status: 200,
              };

            } else {
              return {
                status: 400,
                errorMessage: 'Something went wrong! Please try again.'
              }
            }
          } else {
            return {
              status: 400,
              errorMessage: "Something went wrong! Please try again."
            }
          }
        }
      } else {
        return {
          status: 500,
          errorMessage: 'Please login with your account and try again.'
        };
      }
    } catch (error) {
      return {
        errorMessage: 'Something went wrong' + error,
        status: 400
      };
    }
  },
};

export default CreateEnquiry;

/**
mutation CreateEnquiry($listId: Int!, $hostId: String!, $content: String!, $userId: String!, $type: String, $startDate: String!, $endDate: String!, $personCapacity: Int) {
  CreateEnquiry(listId: $listId, hostId: $hostId, userId: $userId, content: $content, type: $type, startDate: $startDate, endDate: $endDate, personCapacity: $personCapacity) {
    id
    sentBy
    content
    type
    startDate
    endDate
    personCapacity
    createdAt
    status
  }
}

**/
