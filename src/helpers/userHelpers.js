import { User } from '../data/models';

export async function getUserActiveStatus(id) {
    let status = 200, errorMessage;
    const userData = await User.findOne({
        attributes: ['id', 'userBanStatus', 'userDeletedAt'],
        where: {
            id
        },
        raw: true
    });

    if (userData && (userData.userBanStatus || userData.userDeletedAt)) {
        status = 400;
        errorMessage = 'Oops! ';
        errorMessage = errorMessage + (userData.userBanStatus ? 'It looks like your account is banned.' : 'Unable to find your account.');
        errorMessage = errorMessage + ' Please contact support'
    }

    return {
        status,
        errorMessage
    };
    
}

export default {
    getUserActiveStatus
};