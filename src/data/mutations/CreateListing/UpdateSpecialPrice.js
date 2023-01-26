// GrpahQL
import {
	GraphQLList as List,
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLNonNull as NonNull,
	GraphQLFloat as FloatType,
} from 'graphql';
import moment from 'moment';
import sequelize from 'sequelize';

// Sequelize models
import {
	Listing,
	ListBlockedDates
} from '../../../data/models';

// GraphQL Type
import ListBlockedDatesResponseType from '../../types/ListBlockedDatesType';

import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const UpdateSpecialPrice = {

	type: ListBlockedDatesResponseType,

	args: {
		listId: { type: new NonNull(IntType) },
		blockedDates: { type: new List(StringType) },
		calendarStatus: { type: StringType },
		isSpecialPrice: { type: FloatType }
	},

	async resolve({ request, response }, {
		listId,
		blockedDates,
		calendarStatus,
		isSpecialPrice
	}) {

		try {
			let dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
			let newBlockedDates = [], existingBlockedDates = [], unwantedBlockedDates = [];
			// Check whether user is logged-in or not
			if (request.user || (request.user && request.user.admin)) {

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
				if (userStatusErrorMessage) {
					return {
						status: userStatusError,
						errorMessage: userStatusErrorMessage
					};
				}

				let where = { listId };

				if (request.user && !request.user.admin) {
					where = {
						listId,
						userId: request.user.id
					}
				};

				// Check whether the listing is available or not
				const isListingAvailable = await Listing.findOne({
					attributes: ['id'],
					where: { id: listId }
				});

				if (isListingAvailable) {
					if (blockedDates && blockedDates.length > 0) {
						const blockedDatesArray = blockedDates.map((o) => { // Preparing the dates look up ['YYYY-MM-DD', 'YYYY-MM-DD']
							return o.match(dateFormatRegex) ? o : moment.utc(o).format('YYYY-MM-DD');
						});

						await Promise.all(blockedDatesArray.map(async (date, index) => {
							let blockedDatesFind = await ListBlockedDates.findAll({
								attributes: ['id', 'reservationId', 'blockedDates', 'calendarStatus', 'isSpecialPrice', 'dayStatus'],
								where: {
									blockedDates: sequelize.where(
										sequelize.fn('DATE', sequelize.col('blockedDates')),
										date
									),
									listId,
									reservationId: null,
								},
								raw: true,
							});

							// let dayStatus = index === 0 ? 'secondHalf' : 'full';
							// if (index === blockedDatesArray.length - 1) dayStatus = 'firstHalf';

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
								// 	isCreated = true;
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
									blockedDates: date,
									calendarStatus,
									isSpecialPrice,
								});
							}
						}));

						const results = await ListBlockedDates.findAll({
							where: {
								listId
							},
							raw: true
						});

						return await {
							results,
							status: 200
						};
					} else {
						return {
							status: 400,
							errorMessage: 'Please choose the dates.'
						}
					}
				} else {
					return {
						status: 400,
						errorMessage: 'Oops! Unable to find the listing. Please try again.'
					};
				}
			} else {
				return {
					status: 500,
					errorMessage: 'Please login with your account and try again.'
				};
			}
		} catch (error) {
			return {
				status: 400,
				errorMessage: 'Something went wrong' + error
			};
		}
	}
};

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
			},
		});
}

export default UpdateSpecialPrice;


/*
mutation (
	$listId: Int!,
	$blockedDates: [String]
) {
	UpdateSpecialPrice (
		listId: $listId,
		blockedDates: $blockedDates
	)
	{
		status
	}
}
*/