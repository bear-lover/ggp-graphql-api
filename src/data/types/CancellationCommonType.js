import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List
} from 'graphql';

import CancellationType from './CancellationType';

const CancellationCommonType = new ObjectType({

    name: 'CancellationCommonType',

    fields: {
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        },
        result: {
            type: CancellationType
        },
        results: {
            type: new List(CancellationType)
        },
    }

});

export default CancellationCommonType;