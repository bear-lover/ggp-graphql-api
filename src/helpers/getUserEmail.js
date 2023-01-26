import { User } from '../data/models';

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

    return {
        email: userData && userData.email
    };

}

export default {
    getUserEmail
};