// GrpahQL
import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import moment from 'moment';

import SendMessageType from '../../types/SendMessageType';
import { sendNotifications } from '../../../helpers/sendNotifications';

// Sequelize models
import { ThreadItems, Threads, User, Reservation, ListBlockedDates, UserProfile } from '../../../data/models';

import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const ReservationStatus = {
    type: SendMessageType,
    args: {
        threadId: { type: new NonNull(IntType) },
        content: { type: StringType },
        type: { type: StringType },
        startDate: { type: StringType },
        endDate: { type: StringType },
        personCapacity: { type: IntType },
        reservationId: { type: IntType },
        actionType: { type: StringType }
    },
    async resolve({ request, response }, {
        threadId,
        content,
        type,
        startDate,
        endDate,
        personCapacity,
        reservationId,
        actionType
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
                let where = {
                    id: userId,
                    userBanStatus: 1
                }
                // Check whether User banned by admin
                const isUserBan = await User.findOne({ where });
                let isStatus = false;
                if (!isUserBan) {
                    let notifyUserId, notifyUserType, notifyContent;
                    let hostId, guestId, userName, listId;

                    const getThread = await Threads.findOne({
                        where: {
                            id: threadId
                        },
                        raw: true
                    });

                    if (getThread && getThread.host && getThread.guest) {
                        notifyUserId = getThread.host === userId ? getThread.guest : getThread.host;
                        notifyUserType = getThread.host === userId ? 'guest' : 'host';
                    }

                    const hostProfile = await UserProfile.findOne({
                        where: {
                            userId: getThread.host
                        }
                    });

                    if (hostProfile) {
                        userName = hostProfile && hostProfile.firstName
                    }

                    listId = getThread && getThread.listId;

                    // const checkAvailableDates = await ListBlockedDates.findAll({
                    //     where: {
                    //         listId,
                    //         blockedDates: {
                    //             $between: [moment(startDate).format('YYYY-MM-DD HH:MM:SS'), moment(endDate).format('YYYY-MM-DD HH:MM:SS')]
                    //         },
                    //         calendarStatus: {
                    //             $notIn: ['available']
                    //         }
                    //     }
                    // });

                    // if (checkAvailableDates && checkAvailableDates.length > 0) {
                    //     return {
                    //         status: 400,
                    //         errorMessage: 'Those dates are not available.'
                    //     };
                    // }

                    if (type == 'approved' || type == 'declined') {

                        let statusFilter = {
                            $in: ['approved', 'declined']
                        };

                        const checkStatus = await ThreadItems.findOne({
                            where: {
                                threadId,
                                sentBy: userId,
                                startDate,
                                endDate,
                                personCapacity,
                                reservationId,
                                $or: [
                                    {
                                        type: statusFilter
                                    }
                                ]
                            }
                        });

                        if (checkStatus) {
                            return {
                                status: 400,
                                errorMessage: 'Oops! you have already performed this action!',
                            }
                        }
                    }

                    if (actionType == 'approved') {


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
                        }

                        const updateReservation = await Reservation.update({
                            reservationState: 'approved'
                        },
                            {
                                where: {
                                    id: reservationId
                                }
                            }
                        );

                        isStatus = true;
                        notifyContent = {
                            "screenType": "trips",
                            "userType": notifyUserType.toString(),
                            "userName": userName
                        };
                    } else if (actionType == 'declined') {


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
                        }

                        const updateReservation = await Reservation.update({
                            reservationState: type
                        },
                            {
                                where: {
                                    id: reservationId
                                }
                            }
                        );

                        const unlockBlockedDates = await ListBlockedDates.update({
                            reservationId: null,
                            calendarStatus: 'available'
                        }, {
                            where: {
                                reservationId,
                                calendarStatus: 'blocked',
                                isSpecialPrice: {
                                    $ne: null
                                }
                            }
                        });

                        const unblockDatesWithOutPrice = await ListBlockedDates.destroy({
                            where: {
                                reservationId,
                                calendarStatus: 'blocked',
                                isSpecialPrice: {
                                    $eq: null
                                }
                            }
                        });

                        isStatus = true;
                        notifyContent = {
                            "screenType": "trips",
                            "userType": notifyUserType.toString(),
                            "userName": userName
                        };

                    }

                    if (isStatus) {
                        sendNotifications(actionType, notifyContent, notifyUserId);
                        return {
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
export default ReservationStatus;
