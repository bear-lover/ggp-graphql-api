// Models
import { Cancellation } from '../../../models';

// Types
import CancellationCommonType from '../../../types/CancellationCommonType';

const getCancelPolicies = {

    type: CancellationCommonType,

    async resolve({ request }) {
        try {

            const results = await Cancellation.findAll({
                attributes: [
                    'id', 'policyName', 'policyContent', 'subContent', 'subTitle', 'content1', 'content2', 'content3', 'priorDays'
                ]
            });

            return {
                status: 200,
                results
            }

        } catch (error) {
            return {
                status: 400,
                errorMessage: error
            }
        }
    }
};

export default getCancelPolicies;

