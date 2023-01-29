export function getSubject(type) {
	let subject, previewText;

	if (type === 'welcomeEmail' || type === 'confirmEmail') {
		subject = 'Please confirm your e-mail address';
		previewText = 'Action Required! Confirm your e-mail address';
	}
	if (type === 'bookingRequest') {
		subject = 'You have a new reservation';
		previewText = 'Great News! You have a new reservation';
	}
	if (type === 'bookingRequestGuest') {
		subject = 'Your reservation request sent to your host';
		previewText = 'Great News! Your reservation is shared with host';
	}
	if (type === 'bookingConfirmedToHost') {
		subject = 'You have confirmed a reservation';
		previewText = 'Confirmed Reservation Details';
	}
	if (type === 'bookingConfirmedToGuest') {
		subject = 'Your reservation is confirmed by your host';
		previewText = 'Pack your bag, get ready for your trip.';
	}
	if (type === 'bookingDeclinedToGuest') {
		subject = 'Your reservation request is declined by your host';
		previewText = "It's unfortunate to inform you that your reservation request has been declined";
	}
	if (type === 'bookingExpiredGuest') {
		subject = 'Your reservation request is expired';
		previewText = "It's unfortunate to inform you that your reservation request has been expired";
	}
	if (type === 'bookingExpiredHost') {
		subject = 'Reservation Expired!';
		previewText = "It's unfortunate to inform you that your reservation has been expired";
	}
	if (type === 'cancelledByHost') {
		subject = 'Your reservation is cancelled by host';
		previewText = "It's unfortunate to inform you that your booking has been cancelled";
	}
	if (type === 'cancelledByGuest') {
		subject = 'Your reservation is cancelled by guest';
		previewText = "It's unfortunate to inform you that your reservation has been cancelled";
	}
	if (type === 'completedGuest') {
		subject = 'Please write a review for your stay experience';
		previewText = "Greetings! It's great to have a review on your stay experience";
	}
	if (type === 'completedHost') {
		subject = 'Please write a review for your guest';
		previewText = "Greetings! It's great to have a review on your reservation experience";
	}
	if (type === 'forgotPasswordLink') {
		subject = 'Reset your Password';
		previewText = 'Action Required! Reset your Password using the link shared';
	}
	if (type === 'message') {
		subject = 'You have got a new message';
		previewText = 'Someone sent you a new message!';
	}

	if (type === 'inquiry') {
		subject = 'You have got a new inquiry';
		previewText = 'Someone sent you an inquiry from contact form!';
	}

	if (type === 'documentVerification') {
		subject = 'Documents verification status';
		previewText = 'Documents verification status';
	}
	if (type === 'contact') {
		subject = 'You got a customer support notification';
		previewText = 'You got a customer support notification';
	}
	if (type === 'reportUser') {
		subject = 'You got a notification for user violation';
		previewText = 'You have received a notification regarding user violation';
	}
	if (type === 'bookingPreApproval') {
		subject = 'Host pre-approved your request';
		previewText = 'Greetings! Your pre-approval request has been accepted by the host';
	}

	if (type === 'banStatusServiceStatusBanned') {
		subject = 'Your account has been disabled';
		previewText = "It's unfortunate to inform you that your account has been disabled";
	}
	if (type === 'banStatusServiceStatusUnBanned') {
		subject = 'Your account has been enabled';
		previewText = "Greetings! It's fortunate to inform you that your account has been enabled";
	}
	if (type === 'contactSupport') {
		subject = 'You have got a customer support notification';
		previewText = 'You have got a customer support notification';
	}
	if (type === 'userFeedback') {
		subject = 'You have got a Customer Feedback notification';
		previewText = 'You have got a Customer Feedback notification';
	}
	if (type === 'listPublishRequest') {
		subject = 'You have new listing submission for approval';
		previewText = 'You have new listing submission for approval';
	}
	if (type == 'adminListApprove') {
		subject = 'Your Listing submission is Approved';
		previewText = 'Greetings! Your listing submission has been approved';
	}
	if (type == 'adminListReject') {
		subject = 'Your Listing submission is Rejected';
		previewText = "It's unfortunate to inform you that your listing submission has been rejected";
	}

	return {
		subject,
		previewText
	};
}