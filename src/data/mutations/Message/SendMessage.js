// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import SendMessageType from '../../types/SendMessageType';
// Sequelize models
import { ThreadItems, Threads, User, UserProfile, Listing } from '../../../data/models';
import { sendNotifications } from '../../../helpers/sendNotifications';
import { sendEmail } from '../../../libs/sendEmail';
import { getUserEmail } from '../../../helpers/getUserEmail';

import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const SendMessage = {
  type: SendMessageType,
  args: {
    threadId: { type: new NonNull(IntType) },
    content: { type: StringType },
    type: { type: StringType },
    startDate: { type: StringType },
    endDate: { type: StringType },
    personCapacity: { type: IntType },
    reservationId: { type: IntType },
  },
  async resolve({ request, response }, {
    threadId,
    content,
    type,
    startDate,
    endDate,
    personCapacity,
    reservationId
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

        const userId = request.user.id;
        let emailContent;
        let where = {
          id: userId,
          userBanStatus: 1
        };
        let notifyUserId, guestId, hostId, notifyUserType;
        let userName, listId, notifyContent = {};

        // Check whether User banned by admin
        const isUserBan = await User.findOne({ where });
        if (!isUserBan) {
          // Create a thread item
          const threadItems = await ThreadItems.create({
            threadId,
            sentBy: userId,
            content,
            type,
            startDate,
            endDate,
            personCapacity,
            reservationId
          });
          if (threadItems) {

            const updateThreads = await Threads.update({
              isRead: false,
              messageUpdatedDate: new Date()
            },
              {
                where: {
                  id: threadId
                }
              }
            );

            const getThread = await Threads.findOne({
              where: {
                id: threadId
              },
              raw: true
            });

            if (getThread && getThread.host && getThread.guest) {
              notifyUserId = getThread.host === userId ? getThread.guest : getThread.host;
              notifyUserType = getThread.host === userId ? 'guest' : 'host';
              guestId = getThread.host === userId ? getThread.guest : getThread.host;
              hostId = getThread.host === userId ? getThread.host : getThread.guest;
              listId = getThread.listId;
            }



            const hostProfile = await UserProfile.findOne({
              where: {
                userId: getThread.host
              }
            });

            const guestProfile = await UserProfile.findOne({
              where: {
                userId: getThread.guest
              }
            });

            const guestEmailDetail = await User.findOne({
              attributes: ['email'],
              where: {
                id: getThread.guest
              },
              raw: true
            });

            if (hostProfile && guestProfile && getThread) {
              //  userName = getThread.host === userId ? (guestProfile && guestProfile.displayName) : (hostProfile && hostProfile.displayName);
              userName = getThread.host === userId ? (hostProfile && hostProfile.firstName) : (guestProfile && guestProfile.firstName);
            }

            let messageType = 'newMessage';
            notifyContent = {
              "screenType": "message",
              "userType": notifyUserType.toString(),
              "threadId": threadId.toString(),
              "guestId": guestId.toString(),
              "guestName": guestProfile && ((guestProfile.displayName).toString()),
              "guestPicture": (guestProfile && guestProfile.picture) ? ((guestProfile.picture).toString()) : '',
              "hostId": hostId.toString(),
              "hostName": hostProfile && ((hostProfile.displayName).toString()),
              "hostPicture": (hostProfile && hostProfile.picture) ? ((hostProfile.picture).toString()) : '',
              "guestProfileId": guestProfile && ((guestProfile.profileId).toString()),
              "hostProfileId": hostProfile && ((hostProfile.profileId).toString()),
              "listId": listId.toString(),
              "userName": userName,
              "content": content
            };

            if (type == 'preApproved') {
              messageType = 'preApprove';
              notifyContent = {
                "screenType": "message",
                "userType": "guest",
                "threadId": threadId.toString(),
                "guestId": guestId.toString(),
                "guestName": guestProfile && ((guestProfile.displayName).toString()),
                "guestPicture": (guestProfile && guestProfile.picture) ? ((guestProfile.picture).toString()) : '',
                "hostId": hostId.toString(),
                "hostName": hostProfile && ((hostProfile.displayName).toString()),
                "hostPicture": (hostProfile && hostProfile.picture) ? ((hostProfile.picture).toString()) : '',
                "guestProfileId": guestProfile && ((guestProfile.profileId).toString()),
                "hostProfileId": hostProfile && ((hostProfile.profileId).toString()),
                "listId": listId.toString(),
                "userName": userName,
              };

              const listData = await Listing.findOne({
                attributes: ['title'],
                where: {
                  id: listId
                },
                raw: true
              });

              // Email template - Pre-Approve
              emailContent = {
                guestName: guestProfile && guestProfile.firstName,
                hostName: hostProfile && hostProfile.firstName,
                listTitle: listData && listData.title,
                threadId,
              };

              sendEmail(guestEmailDetail.email, 'bookingPreApproval', emailContent);

            }

            // sendNotifications(notifyContent, notifyUserId);
            if (type !== 'approved' && type !== 'declined') {
              sendNotifications(messageType, notifyContent, notifyUserId);
            }

            if (type === 'message') { // Send Message - Email template
              emailContent = {
                receiverName: (notifyUserType === 'guest' ? (guestProfile && guestProfile.firstName) : (hostProfile && hostProfile.firstName)),
                senderName: (notifyUserType === 'guest' ? (hostProfile && hostProfile.firstName) : (guestProfile && guestProfile.firstName)),
                receiverType: notifyUserType,
                type: notifyUserType,
                message: content,
                threadId
              };

              const { email } = await getUserEmail(notifyUserId);

              sendEmail(email, 'message', emailContent);
            }

            return {
              results: threadItems,
              status: 200,
            };

          } else {
            return {
              status: 400,
              errorMessage: 'Something went wrong,Failed to create thread items',
            }
          }

        } else {
          return {
            status: 500,
            errorMessage: 'Oops! It looks like your account is disabled at the moment. Please contact our support.'
          }
        }
      } else {
        return {
          status: 500,
          errorMessage: "Please login with your account and try again."
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
export default SendMessage;
