// GrpahQL
import {
  GraphQLInt as IntType,
  GraphQLString as StringType,
} from 'graphql';

// GraphQL Type
import EditListingType from '../../types/EditListingType';

// Sequelize models
import {
  Listing
} from '../../models';

const submitForVerification = {

  type: EditListingType,

  args: {
    id: { type: IntType },
    listApprovalStatus: { type: StringType },
  },

  async resolve({ request, response }, {
    id,
    listApprovalStatus,
  }) {

    let isListUpdated = false;

    if (request.user || request.user.admin) {

      let where = { id };
      if (!request.user.admin) {
        where = {
          id,
          userId: request.user.id
        }
      };

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
        return {
          status: "200"
        }
      } else {
        return {
          status: "400"
        }
      }

    } else {
      return {
        status: 500
      };
    }

  },
};

export default submitForVerification;

