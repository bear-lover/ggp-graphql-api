import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType,
    GraphQLList as List
} from 'graphql';

import sequelize from '../../sequelize';

// Types
import ImageBannerType from '../ImageBannerType';
import PopularLocationType from '../../types/siteadmin/PopularLocationType';
import HomeBannerType from '../../types/HomeBannerType';
import StaticBlockType from '../../types/siteadmin/StaticBlockType';
import ShowListingType from '../../types/ShowListingType';

import { HomeBanner, ImageBanner, PopularLocation, StaticInfoBlock, Recommend, Listing, ListViews } from '../../models';

const BannerCommonType = new ObjectType({
    name: 'BannerCommonType',
    fields: {
        id: { type: IntType },
        title: {  type: StringType },
        content: { type: StringType },
        isEnable: { type: BooleanType },
        getHomeBanner: {
            type: new List(HomeBannerType),
            resolve() {
              return HomeBanner.findAll({});
            }
        },
        // getImageBanner: {
        //     type: ImageBannerType,
        //     resolve() {
        //       return ImageBanner.findOne({});
        //     }
        // },
        // getPopularLocationAdmin: {
        //     type: new List(PopularLocationType),
        //     resolve() {
        //       return PopularLocation.findAll({});
        //     }
        // },
        // getStaticInfo: {
        //     type: new List(StaticBlockType),
        //     resolve() {
        //       return StaticInfoBlock.findAll({
        //         attributes: [
        //             'id',
        //             'title',
        //             'content',
        //             'image',
        //             'name',
        //             'isEnable'
        //         ],
        //       });
        //     }
        // },
        // getRecommend: {
        //     type: new List(ShowListingType),
        //     resolve() {
        //         return Listing.findAll({
        //             attributes: ['id', 'title', 'beds','bookingType', 'coverPhoto'],
        //             where: { isPublished: true },
        //             include: [
        //               { model: Recommend, as: "recommend", required: true },
        //             ]
        //           });
        //     }
        // },
        // getMostViewedListing: {
        //     type: new List(ShowListingType),
        //     resolve() {
        //         return Listing.findAll({
        //             attributes: ['id', 'title', 'beds','bookingType', 'coverPhoto'],
        //             where: {
        //                 isPublished: true
        //             },
        //             include: [
        //                 {
        //                     model: ListViews,
        //                     attributes: [],
        //                     as: 'listViews',
        //                     required: true,
        //                     duplicating: false
        //                 }
        //             ],
        //             order: [
        //                 [sequelize.fn('count', sequelize.col('listViews.listId')), 'DESC'],
        //             ],
        //             group: ['listViews.listId'],
        //             limit: 10,
        //             offset: 0
        //         });
        //     }
        // }
    }
});

export default BannerCommonType;