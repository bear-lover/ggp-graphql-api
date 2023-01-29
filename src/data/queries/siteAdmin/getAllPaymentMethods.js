import { PaymentMethods } from '../../models';
import PaymentMethodsType from '../../types/PaymentMethodsType';

const getAllPaymentMethods = {
    type: PaymentMethodsType,

    async resolve({ request }) {
        try {
            if (request.user && request.user.admin) {
                let results = await PaymentMethods.findAll();
                return {
                    status: 200,
                    results
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'Oops! Please login and continue.'
                };
            }
        } catch (error) {
            return await {
                status: 400,
                errorMessage: 'Oops! Something went wrong! ' + error
            };
        }
    }
}

export default getAllPaymentMethods;