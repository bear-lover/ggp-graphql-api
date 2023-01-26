import GetPaymentType from '../../types/GetPaymentType';
import { PaymentMethods } from '../../../data/models';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const getPaymentMethods = {

	type: GetPaymentType,

	async resolve({ request }) {
		try {

			if (request.user) {

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
				if (userStatusErrorMessage) {
					return {
						status: userStatusError,
						errorMessage: userStatusErrorMessage
					};
				}

				const getData = await PaymentMethods.findAll({
					where: {
						isEnable: true
					}
				});

				if (getData) {
					return {
						results: getData,
						status: 200
					}
				} else {
					return {
						status: 400,
						errorMessage: "Something Went Wrong"
					}
				}
			} else {
				return {
					status: 500,
					errorMessage: 'You haven\'t authorized for this action.',
				};
			}

		} catch (error) {

			return {
				errorMessage: 'Something went wrong.' + error,
				status: 400
			}
		}
	}
};

export default getPaymentMethods;

/*
{
	getPaymentMethods{
		errorMessage
		status
		results{
			id
			name
		}
	}
}
*/