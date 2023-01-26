import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List
} from 'graphql';
// Models

import ReviewsType from './ReviewsType';


const ReviewCommonType = new ObjectType({
    name: 'Reviewlist',
    fields: {
        results: { 
            type: new List(ReviewsType)
        },
        count: {
            type: IntType
        },
        currentPage: {
            type: IntType
        },
        ownerType: {
            type: StringType
        },
        status: { 
            type: IntType 
        },
        errorMessage: { 
            type: StringType 
        }
    }
});

export default ReviewCommonType;
