import ListBlockedDatesType from '../../types/ListBlockedDatesType';

import { ListBlockedDates, Listing } from '../../models';
import moment from 'moment';
import sequelize from 'sequelize';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
} from 'graphql';

const UpdateBlockedDates = {

    type: ListBlockedDatesType,

    args: {
        listId: { type: new NonNull(IntType) },
        blockedDates: { type: new List(StringType) },
        calendarStatus: { type: StringType },
        isSpecialPrice: { type: FloatType }
    },

    async resolve({ request }, { listId, blockedDates, calendarStatus, isSpecialPrice }) {

        // Check whether user is logged in
        if (request.user || request.user.admin) {

            // Blocked Dates
            if (blockedDates) {
                await Promise.all(blockedDates.map(async (item, index) => {
                    let day = moment(item).format('YYYY-MM-DD');
                    let dayList = sequelize.where(sequelize.fn('DATE', sequelize.col('blockedDates')), day);

                    let blockedDatesFind = await ListBlockedDates.findAll({
                        where: {
                            blockedDates: dayList,
                            listId: listId,
                            reservationId: null
                        }
                    })

                    // let dayStatus = index === 0 ? 'secondHalf' : 'full';
                    // if (index === blockedDates.length - 1) dayStatus = 'firstHalf';
                    let dayStatus = 'full';
                    if (index === blockedDates.length - 1) dayStatus = 'firstHalf';
                    if (index === 0) dayStatus = 'secondHalf';

                    let isCreated = false;

                    if (blockedDatesFind && blockedDatesFind.length == 0) {
                        isCreated = true
                    }

                    if (blockedDatesFind && blockedDatesFind.length == 1) {
                        let value = blockedDatesFind[0];

                        if (value.dayStatus === 'full' && ['firstHalf', 'secondHalf'].includes(dayStatus)) {
                            await updateBlockedDate({
                                dayStatus:
                                    dayStatus === 'firstHalf'
                                        ? 'secondHalf'
                                        : 'firstHalf',
                                calendarStatus: value.calendarStatus,
                                isSpecialPrice: value.isSpecialPrice,
                                id: value.id,
                            });
                            isCreated = true
                        }
                        // else if (value.dayStatus !== 'full' && value.dayStatus !== dayStatus) {
                        //     isCreated = true;
                        // } 
                        else {
                            await updateBlockedDate({
                                dayStatus,
                                calendarStatus,
                                isSpecialPrice,
                                id: value.id,
                            });
                        }
                    }

                    if (blockedDatesFind && blockedDatesFind.length == 2) {
                        if (dayStatus === 'full') {
                            isCreated = true;
                            await ListBlockedDates.destroy({
                                where: {
                                    id: blockedDatesFind.map(item => item.id)
                                }
                            });
                        } else {
                            let updateId = blockedDatesFind.find(item => item.dayStatus === dayStatus);
                            if (updateId) {
                                await updateBlockedDate({
                                    dayStatus,
                                    calendarStatus,
                                    isSpecialPrice,
                                    id: updateId.id,
                                });
                            }
                        }
                    }

                    if (isCreated) {
                        await ListBlockedDates.create({
                            listId,
                            dayStatus,
                            blockedDates: day,
                            calendarStatus,
                            isSpecialPrice,
                        });
                    }

                }));

                return {
                    status: '200'
                };

            } else {
                return {
                    status: '500'
                };
            }
        }
    }
};

export default UpdateBlockedDates;


const updateBlockedDate = async ({
    dayStatus,
    calendarStatus,
    isSpecialPrice,
    id
}) => {
    await ListBlockedDates.update({
        dayStatus,
        calendarStatus,
        isSpecialPrice,
    },
        {
            where: {
                id,
                reservationId: null
            },
        });
}

/**
mutation($listId: Int!, $blockedDates: [String]) {
UpdateBlockedDates(listId: $listId, blockedDates: $blockedDates) {
status
}
}
*/