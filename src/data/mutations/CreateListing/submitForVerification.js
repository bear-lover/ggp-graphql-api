// GrpahQL
import {
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
// Sequelize models
import {
  Listing,
  ListingPermissionHistory,
  UserProfile
} from '../../models';
// GraphQL Type
import EditListingType from '../../types/EditListingType';
import { getConfigurationData } from '../../../helpers/getConfigurationData';
import { sendEmail } from '../../../libs/sendEmail';

import checkUserBanStatus from '../../../libs/checkUserBanStatus';

const submitForVerification = {

  type: EditListingType,

  args: {
    id: { type: new NonNull(IntType) },
    listApprovalStatus: { type: StringType },
  },

  async resolve({ request, response }, {
    id,
    listApprovalStatus,
  }) {

    try {

      let isListUpdated = false;

      if (request.user) {

        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }

        let userId = request.user.id;
        let where = {
          id,
          userId
        }

        const listDetails = await Listing.findOne({
          attributes: ['title'],
          where: {
            id
          },
          raw: true
        });

        const userDetails = await UserProfile.findOne({
          attributes: ['firstName'],
          where: {
            userId
          },
          raw: true
        });

        const doUpdateListing = await Listing.update({
          listApprovalStatus
        },
          {
            where
          })
          .spread(function (instance) {
            // Check if any rows are affected
            if (instance > 0) {
              isListUpdated = true;
            }
          });

        if (isListUpdated) {

          let content = {
            listId: id,
            listTitle: listDetails && listDetails.title,
            hostName: userDetails && userDetails.firstName,
          }

          const createHistory = await ListingPermissionHistory.create({
            listId: id,
            userId,
            status: 'submitForverification'
          });

          const configData = await getConfigurationData({ name: ['email'] });

          sendEmail(configData.email, 'listPublishRequest', content);

          return {
            status: 200
          }

        } else {
          return {
            status: 400,
            errorMessage: 'Oops! Unable to submit the listing. Please try again.'
          }
        }

      } else {
        return {
          status: 500,
          errorMessage: 'Please login with your account and try again.'
        };
      }
    } catch (error) {
      return {
        errorMessage: 'Something went wrong! ' + error,
        status: 400
      }
    }

  },
};

export default submitForVerification;

