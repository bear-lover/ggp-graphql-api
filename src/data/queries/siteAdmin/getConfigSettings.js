import {
	GraphQLString as StringType,
	GraphQLList as List
} from 'graphql';

import { SiteSettings } from '../../models';

import SiteSettingsType from '../../types/siteadmin/SiteSettingsType';

const getConfigSettings = {

	type: new List(SiteSettingsType),

	args: {
		name: { type: StringType }
	},

	async resolve({ request }, { name }) {

		try {

			const sitedata = JSON.parse(name);

			const results = await SiteSettings.findAll({
				attributes: [
					'id',
					'name',
					'value',
				],
				where: {
					name: {
						$in: sitedata
					}
				}
			});

			return await results;

		} catch (e) {
			return {
				status: '400',
				errorMessage: 'Oops! Something happened ' + e
			}
		}
	}
};

export default getConfigSettings;
