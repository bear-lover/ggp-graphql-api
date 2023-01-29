import {
  GraphQLList as List,
  GraphQLString as String
} from 'graphql';
import { Listing } from '../../data/models';
import ManageListingCommonType from '../types/ManageListingCommonType';

const ManageListings = {

  type: ManageListingCommonType,

  args: {
    searchKey: { type: String }
  },

  async resolve({ request }, { searchKey }) {

    if (request.user && request.user.admin != true) {

      let where = {
        userId: request.user.id,
      }

      if (searchKey) {
        where = {
          title: {
            $like: '%' + searchKey + '%'
          },
          userId: request.user.id,
        }
      }

      const results = await Listing.findAll({
        where,
        order: [['createdAt', 'DESC']]
      });


      const userListingCount = await Listing.count({
        where: {
          userId: request.user.id,
        },
      });

      return {
        status: 200,
        results,
        userListingCount,
        searchKey
      };

    } else {
      return {
        status: "notLoggedIn"
      }
    }

  },
};

export default ManageListings;
