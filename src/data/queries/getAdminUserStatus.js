import UserType from '../types/UserType';
import { AdminUser } from '../models';
const getAdminUserStatus = {
    type: UserType,
    async resolve({ request }) {
        // Check if user already logged in
        if (request.user) {
            const userData = await AdminUser.findOne({
                attributes: [
                    'id', 'email'
                ],
                where: {
                    id: request.user.id,
                    email: request.user.email
                }
            })
            if (userData) {
                return {
                    status: 'UserExist',
                    userExistStatus: false
                }
            } else {
                return {
                    status: 'NoUserExist',
                    userExistStatus: true
                };
            }
        } else {
            return {
                status: "notLoggedIn",
                userExistStatus: true
            };
        }
    }
};
export default getAdminUserStatus;