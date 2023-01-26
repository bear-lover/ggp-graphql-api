// GrpahQL
import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';

import ReviewCommonType from '../../types/ReviewCommonType';

// Sequelize models
import { Reviews, UserProfile } from '../../models';
import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const userReviews = {

    type: ReviewCommonType,

    args: {
        ownerType: { type: StringType },
        currentPage: { type: IntType },
        profileId: { type: IntType },
    },

    async resolve({ request, response }, { ownerType, currentPage, profileId }) {
        try {

            if (request && request.user) {
                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }
            }
            
            let offset = 0, limit = 10, userId, where = {};
            if (currentPage) offset = (currentPage - 1) * limit;
            if (profileId) {
                const getUserProfileData = await UserProfile.findOne({
                    attributes: ['userId'],
                    where: {
                        profileId
                    },
                    raw: true
                });
                userId = getUserProfileData && getUserProfileData.userId;
            } else {
                if (request.user && !request.user.admin) userId = request.user.id;
            }

            if (ownerType === 'me') {
                where = { authorId: userId };
            } else {
                where = { userId };
            }

            const results = await Reviews.findAll({
                where,
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            if (results && results.length > 0) {
                return {
                    status: 200,
                    results
                };
            } else {
                return {
                    status: 400,
                    errorMessage: 'No reviews found!'
                };
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: 'Oops! Something went wrong. ' + error
            };
        }
    }
};

export default userReviews;