import {
	GraphQLBoolean as BooleanType,
	GraphQLInt as IntType,
	GraphQLNonNull as NonNull,
} from 'graphql';
import { PaymentMethods, Payout } from '../../models';
import PaymentMethodsType from '../../types/PaymentMethodsType';

const updatePaymentGatewayStatus = {
	type: PaymentMethodsType,
	args: {
		id: { type: new NonNull(IntType) },
		isEnable: { type: new NonNull(BooleanType) }
	},

	async resolve({ request }, { id, isEnable }) {
		try {

			if (request.user && request.user.admin) {
				let isAllow = 0;
				let getStatus = await PaymentMethods.findAll({
					where: {
						isEnable: 1
					},
					raw: true
				});

				if (getStatus && getStatus.length == 1 && isEnable == false) {
					isAllow = 1;
				}
				if (isAllow === 0) {
					let updateStatus = await PaymentMethods.update({
						isEnable
					}, {
						where: {
							id
						}
					});
					if (!isEnable) {
						let updatePayouts = await Payout.update({
							default: false
						}, {
							where: {
								methodId: id
							}
						});
					}
					return {
						status: updateStatus ? 200 : 400,
						errorMessage: updateStatus ? null : 'Please try again!'
					}
				} else {
					return {
						status: 400,
						errorMessage: 'Atleast one option must be active'
					}
				}
			}
		} catch (error) {
			return await {
				status: 400,
				errorMessage: 'Oops! Something went wrong! ' + error
			};
		}
	}
}

export default updatePaymentGatewayStatus;