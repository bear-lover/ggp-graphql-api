import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLFloat as FloatType,
} from 'graphql';
import { Cancellation } from '../../../models';
import CancellationCommonType from '../../../types/CancellationCommonType';

const updateCancelPolicy = {
    type: CancellationCommonType,
    args: {
        id: { type: IntType },
        policyName: { type: StringType },
        policyContent: { type: StringType },
        priorDays: { type: IntType },
        accommodationPriorCheckIn: { type: FloatType },
        accommodationBeforeCheckIn: { type: FloatType },
        accommodationDuringCheckIn: { type: FloatType },
        guestFeePriorCheckIn: { type: FloatType },
        guestFeeBeforeCheckIn: { type: FloatType },
        guestFeeDuringCheckIn: { type: FloatType },
        hostFeePriorCheckIn: { type: FloatType },
        hostFeeBeforeCheckIn: { type: FloatType },
        hostFeeDuringCheckIn: { type: FloatType },
        nonRefundableNightsPriorCheckIn: { type: IntType },
        nonRefundableNightsBeforeCheckIn: { type: IntType },
        nonRefundableNightsDuringCheckIn: { type: IntType },
        subTitle: { type: StringType },
        subContent: { type: StringType },
        content1: { type: StringType },
        content2: { type: StringType },
        content3: { type: StringType },
    },
    async resolve({ request }, {
        id,
        policyName,
        policyContent,
        priorDays,
        accommodationPriorCheckIn,
        accommodationBeforeCheckIn,
        accommodationDuringCheckIn,
        guestFeePriorCheckIn,
        guestFeeBeforeCheckIn,
        guestFeeDuringCheckIn,
        hostFeePriorCheckIn,
        hostFeeBeforeCheckIn,
        hostFeeDuringCheckIn,
        nonRefundableNightsPriorCheckIn,
        nonRefundableNightsBeforeCheckIn,
        nonRefundableNightsDuringCheckIn,
        subTitle,
        subContent,
        content1,
        content2,
        content3
    }) {
        try {


            if (request.user && request.user.admin == true) {

                const updatePolicy = await Cancellation.update({
                    policyName,
                    policyContent,
                    priorDays,
                    accommodationPriorCheckIn,
                    accommodationBeforeCheckIn,
                    accommodationDuringCheckIn,
                    guestFeePriorCheckIn,
                    guestFeeBeforeCheckIn,
                    guestFeeDuringCheckIn,
                    hostFeePriorCheckIn,
                    hostFeeBeforeCheckIn,
                    hostFeeDuringCheckIn,
                    nonRefundableNightsPriorCheckIn,
                    nonRefundableNightsBeforeCheckIn,
                    nonRefundableNightsDuringCheckIn,
                    subTitle,
                    subContent,
                    content1,
                    content2,
                    content3
                }, {
                    where: {
                        id: id
                    }
                });
                return {
                    status: updatePolicy ? 200 : 400,
                    errorMessage: updatePolicy ? null : 'Something went wrong! Could not update!'
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

    },
};
export default updateCancelPolicy;
