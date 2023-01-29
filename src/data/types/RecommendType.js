import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType
} from 'graphql';

const RecommendType = new ObjectType({
    name: 'Recommend',
    fields: {
        id: {
            type: IntType
        },
        listId: {
            type: IntType
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        }
    }
});

export default RecommendType;