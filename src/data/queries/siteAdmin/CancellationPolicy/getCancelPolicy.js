import {
	GraphQLInt as IntType,
	GraphQLNonNull as NonNull,
} from 'graphql';

// Models
import { Cancellation } from '../../../models';

// Types
import CancellationCommonType from '../../../types/CancellationCommonType';

const getCancelPolicy = {

	type: CancellationCommonType,

	args: {
		id: { type: new NonNull(IntType) },
	},

	async resolve({ request }, { id }) {
		try {
			if (request.user && request.user.admin === true) {

				const result = await Cancellation.findOne({
					where: {
						id
					}
				});

				return await {
					status: result ? 200 : 400,
					result,
					errorMessage: result ? null : 'No records found.'
				}

			} else {
				return {
					status: 500,
					errorMessage: "Please login with your account and continue."
				}
			}
		} catch (error) {
			return {
                status: 400,
                errorMessage: error
            }
		}
	}
};

export default getCancelPolicy;

