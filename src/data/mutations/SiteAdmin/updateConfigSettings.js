import { GraphQLString as StringType, GraphQLInt as IntType } from 'graphql';

import { SiteSettings } from '../../models';

import UpdateSiteSettingsType from '../../types/siteadmin/UpdateSiteSettingsType';

const updateConfigSettings = {

	type: UpdateSiteSettingsType,

	args: {
		pushNotificationKey: { type: StringType },
		deepLinkBundleId: { type: StringType },
		smtpHost: { type: StringType },
		smtpPort: { type: StringType },
		smptEmail: { type: StringType },
		smtpSender: { type: StringType },
		smtpSenderEmail: { type: StringType },
		smtpPassWord: { type: StringType },
		twillioAccountSid: { type: StringType },
		twillioAuthToken: { type: StringType },
		twillioPhone: { type: StringType },
		paypalEmail: { type: StringType },
		paypalClientId: { type: StringType },
		paypalSecret: { type: StringType },
		paypalHost: { type: StringType },
		paypalHostMode: { type: StringType },
		maxUploadSize: { type: StringType },
		stripePublishableKey: { type: StringType },
	},

	async resolve({ request }, {
		pushNotificationKey,
		deepLinkBundleId,
		smtpHost,
		smtpPort,
		smptEmail,
		smtpSender,
		smtpSenderEmail,
		smtpPassWord,
		twillioAccountSid,
		twillioAuthToken,
		twillioPhone,
		paypalEmail,
		paypalClientId,
		paypalSecret,
		paypalHost,
		paypalHostMode,
		maxUploadSize,
		stripePublishableKey
	}) {
		try {
			if (!request.user || !request.user.admin) {
				return {
					status: 500,
					errorMessage: "Oops! Please login with your account and try again."
				};
			}

			let siteSettingsFields = {
				pushNotificationKey,
				deepLinkBundleId,
				smtpHost,
				smtpPort,
				smptEmail,
				smtpSender,
				smtpSenderEmail,
				smtpPassWord,
				twillioAccountSid,
				twillioAuthToken,
				twillioPhone,
				paypalEmail,
				paypalClientId,
				paypalSecret,
				paypalHost,
				paypalHostMode,
				maxUploadSize,
				stripePublishableKey
			};

			await Promise.all([
				Object.keys(siteSettingsFields).map(async (item) => {
					await SiteSettings.update({ value: siteSettingsFields[item] }, { where: { name: item } })
				})
			]);

			return { status: 200 };
		}
		catch (error) {
			return {
				status: 400,
				errorMessage: "Something went wrong. " + error
			};
		}
	},
};

export default updateConfigSettings;
