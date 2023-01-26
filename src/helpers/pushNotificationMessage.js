import { capitalizeFirstLetter } from './capitalizeFirstLetter';

export async function pushNotificationMessage(actionType, notifyContent) {
    let title = '', message = '';

    if (actionType === 'newEnquiry') {
        title = `New Enquiry`;
        message = `${formatText(notifyContent['userName'])}: ${notifyContent['content']}`;
    }

    if (actionType === 'declined') {
        title = `Declined`;
        message = `${formatText(notifyContent['userName'])}: Booking is Declined`;
    }

    if (actionType === 'approved') {
        title = `Approved`;
        message = `${formatText(notifyContent['userName'])}: Booking is Approved`;
    }

    if (actionType === 'newMessage') {
        title = `New Message`;
        message = `${formatText(notifyContent['userName'])}: ${notifyContent['content']}`;
    }

    if (actionType === 'cancelReservation') {
        title = `Booking is Cancelled`;
        message = `${formatText(notifyContent['userName'])}: ${notifyContent['content']}`;
    }

    if (actionType === 'newBooking') {
        title = `New Booking`;
        message = `${formatText(notifyContent['userName'])}: ${notifyContent['content']}`;
    }

    if (actionType === 'preApprove') {
        title = `New Booking`;
        message = `${formatText(notifyContent['userName'])}: Your request is pre-approved`;
    }

    if (actionType === 'forceUpdate') { // App FORCE UPDATE
        title = `Update`;
        message = 'The using application version is no longer supported. Please upgrade to a newer version.';
    }

    return {
        title,
        message
    };
}

export function formatAmount(amount, currency, locale) {
    let convertCurrency = 'USD';
    if (amount) {
        convertCurrency = currency ? currency : convertCurrency;
        return amount.toLocaleString(locale, { style: 'currency', currency: convertCurrency });
    } else {
        return null;
    }
}

export function formatText(text) {
    let capitalizedText = capitalizeFirstLetter(text);
    return capitalizedText ? capitalizedText.trim() : '';
}