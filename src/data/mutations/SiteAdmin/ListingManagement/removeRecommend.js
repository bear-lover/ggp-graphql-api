import RecommendType from '../../../types/RecommendType';
import { Recommend } from '../../../models';

import {
  GraphQLInt as IntType
} from 'graphql';

const removeRecommend = {

  type: RecommendType,

  args: {
    listId: { type: IntType }
  },

  async resolve({ request }, { listId }) {

    if (request.user && request.user.admin == true) {

      const deleteRecommend = await Recommend.destroy({
        where: {
          listId
        }
      });

      if (deleteRecommend) {
        return {
          listId,
          status: 200
        }
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

export default removeRecommend;
