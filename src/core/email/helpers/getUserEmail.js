import { User, SiteSettings } from '../../../data/models';

export async function getUserEmail(id) {
    const userData = await User.findOne({
        attributes: ['email'],
        where: {
            id,
            userBanStatus: {
                $ne: true
            },
            userDeletedAt: null
        },
        raw: true
    });

    return await userData && userData.email;
}

export async function getConfigurationData({ name }) {
    const results = await SiteSettings.findAll({
        attributes: [
            'id',
            'name',
            'value',
        ],
        where: {
            name: {
                $in: name
            }
        },
        raw: true
    });

    let settingsData = {};

    if (results) {
        await Promise.all(results.map((item, key) => {
            settingsData[item.name] = item.value;
        }));
    }

    return await settingsData;

}