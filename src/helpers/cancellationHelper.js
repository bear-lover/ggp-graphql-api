//Discount calculation
export function getPriceWithDiscount({ basePrice, discount, nights }) {
    if (discount > 0) {
        let singleNightDiscount = discount / nights;
        basePrice = basePrice - singleNightDiscount;
    }
    return basePrice;
}

export function getFixedValue(value) {
    if (!value) return value;
    return Number(value.toFixed(2))
}

export function getSpecificPolicy({
    policyData,
    interval,
    nights
}) {
    let accomodation = 0, cleaningFeePercent = 0, nonRefundableNights = 0, guestFeePercent = 0, remainingNights;
    let beforeDurationFullCleaningFee = [1, 2]; //Policy ID stored

    if (interval > policyData.priorDays) { // Prior
        accomodation = policyData.accommodationPriorCheckIn;
        guestFeePercent = policyData.guestFeePriorCheckIn;
        nonRefundableNights = policyData.nonRefundableNightsPriorCheckIn;
        cleaningFeePercent = 100;
    }
    else if (interval <= policyData.priorDays && interval > 0) { // Before
        accomodation = policyData.accommodationBeforeCheckIn;
        guestFeePercent = policyData.guestFeeBeforeCheckIn;
        nonRefundableNights = policyData.nonRefundableNightsBeforeCheckIn;
        if (beforeDurationFullCleaningFee.includes(policyData.id)) cleaningFeePercent = 100;
    }
    else { // During
        accomodation = policyData.accommodationDuringCheckIn;
        guestFeePercent = policyData.guestFeeDuringCheckIn;
        nonRefundableNights = policyData.nonRefundableNightsDuringCheckIn;
        //If interval is zero, then check-in date is today
        //If interval is not zero, it should be negative value. To include check in date, subtract 1 from the nights.
        remainingNights = (nights - 1) + interval;
    }

    return {
        accomodation,
        cleaningFeePercent,
        nonRefundableNights,
        guestFeePercent,
        remainingNights
    }
}

export function cancelByGuest({
    policyData,
    interval,
    nights,
    cleaningPrice,
    hostServiceFee,
    guestServiceFee,
    total,
    hostServiceFeeType,
    hostServiceFeeValue,
    basePrice// Either special price average or base price from reserveration with discount is set
}) {

    const {
        accomodation,
        cleaningFeePercent,
        nonRefundableNights,
        guestFeePercent,
        remainingNights
    } = getSpecificPolicy({ policyData, interval, nights });

    let refundableNightPrice = 0, nonRefundableNightPrice = 0;
    let updatedHostFee = 0, payoutToHost = 0, hostRefund = 0;
    let checkInNights = (remainingNights == 0 || remainingNights > 0) ? remainingNights : nights;
    let totalNights = checkInNights - nonRefundableNights;

    //Based on the policy, update the guest fee
    let updatedGuestFee = (guestServiceFee * (guestFeePercent / 100)), //This variable stores refunded guest fee value.
        paidAmount = total + guestServiceFee;

    //Based on the policy, update the cleaning price
    cleaningPrice = (cleaningPrice * (cleaningFeePercent / 100));

    //Refund amount without considering guest service fee
    refundableNightPrice = getFixedValue(((totalNights * basePrice) * (accomodation / 100)) + cleaningPrice);

    //Host Payout amount without subtracting host service fee. total has cleaning Fee with in it.
    hostRefund = getFixedValue(total - refundableNightPrice);

    //Adding guest service fee, if it could be refunded
    refundableNightPrice = refundableNightPrice + updatedGuestFee;

    //Payout amount calculated with host service fee
    if (hostRefund > 0) {
        updatedHostFee = getFixedValue(hostServiceFeeType === 'percentage' ? hostRefund * (Number(hostServiceFeeValue) / 100) : hostServiceFee);
        payoutToHost = getFixedValue(hostRefund - updatedHostFee);
    }

    //Non refundable amount calculated based on the total amount guest paid and the refundable amount with guest service fee
    nonRefundableNightPrice = getFixedValue(paidAmount - refundableNightPrice);

    //Only amount should be returned. Convertion is done where the function is called, if the currency is different
    return {
        refundToGuest: refundableNightPrice,
        payoutToHost,
        nonRefundableNightPrice,
        //If this updatedGuestFee with in object is 0, admin won't get guest service fee after cancellation
        guestServiceFee: guestServiceFee - updatedGuestFee, //Either whole guest service is refunded or none based on the policy
        hostServiceFee: updatedHostFee
    };
}

export function cancelByHost({
    interval,
    nights,
    remainingNights,
    total,
    cleaningPrice,
    guestServiceFee, //Guest service fee value, when the reservation is created
    hostServiceFee,  //Host service fee value, when the reservation is created
    hostServiceFeeType, //Host service fee set by admin at the time of creating reservation
    hostServiceFeeValue, //Host service fee type set by admin at the time of creating reservation
    basePrice // Either special price average or base price from reserveration with discount is set
}) {
    let refundAmount = 0, nonPayoutAmount = 0, payoutAmount = 0, hostRefund = 0, refundDays = nights;
    let updatedHostFee = hostServiceFee, updatedGuestFee = guestServiceFee;

    //If the cancellation is done after or during check in date
    if (interval <= 0 && remainingNights < nights) {
        refundDays = remainingNights;
        cleaningPrice = 0;
        guestServiceFee = 0;
    }

    //Refund amount to guest
    refundAmount = getFixedValue((refundDays * basePrice) + cleaningPrice);

    //Host Payout amount without subtracting host service fee. total has cleaning Fee with in it.
    hostRefund = getFixedValue(total - refundAmount);

    //Payout amount calculated with host service fee
    if (hostRefund > 0) {
        nonPayoutAmount = refundAmount; //guest service fee and cleaning fee won't be here
        //New host service fee calculated based on the host refund amount.
        updatedHostFee = getFixedValue(hostServiceFeeType === 'percentage' ? hostRefund * (Number(hostServiceFeeValue) / 100) : hostServiceFee);
        payoutAmount = getFixedValue(hostRefund - updatedHostFee);
    }
    else {
        //Payout amount of host is zero
        nonPayoutAmount = getFixedValue(total - updatedHostFee);
        updatedGuestFee = 0; //Guest fee refunded
        updatedHostFee = 0;
    }

    //Adding guest service fee, if it could be refunded
    refundAmount = refundAmount + guestServiceFee;

    //Only amount should be returned. Convertion is done where the function is called, if the currency is different
    return {
        refundToGuest: refundAmount,
        nonRefundableNightPrice: nonPayoutAmount,
        payoutToHost: payoutAmount,
        hostServiceFee: updatedHostFee,
        guestServiceFee: updatedGuestFee //If this value is 0, admin won't get guest service fee after cancellation
    };
}