import RecommendType from '../../../types/RecommendType';
import { Recommend, Listing } from '../../../models';

import {
  GraphQLInt as IntType
} from 'graphql';

const addRecommend = {

  type: RecommendType,

  args: {
    listId: { type: IntType }
  },

  async resolve({ request }, { listId }) {

    if (request.user && request.user.admin == true) {

      const list = await Listing.findOne({
        where: {
          id: listId,
          isPublished: true
        }
      });

      if (!list) {
        return {
          status: 400,
          errorMessage: "Oops! you could not recommend the unpublished list"
        }
      }

      const insertRecommend = await Recommend.create({
        listId
      });

      if (insertRecommend) {
        return {
          status: 200
        };
      } else {
        return {
          status: 400,
          errorMessage: 'Something went wrong! Please try again.'
        }
      }
    } else {
      return {
        status: 400,
        errorMessage: "You are not logged in, please login and try again!"
      }
    }
  },
};

export default addRecommend;
