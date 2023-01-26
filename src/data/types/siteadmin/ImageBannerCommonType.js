import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType
} from 'graphql';

const ImageBannerType = new ObjectType({
    name: 'ImageBanner',
    fields: {
        id: {
            type: IntType
        },
        title: {
            type: StringType
        },
        description: {
            type: StringType
        },
        buttonLabel: {
            type: StringType
        },
        image: {
            type: StringType
        },
        status: {
            type: StringType
        }
    }
});

const ImageBannerCommonType = new ObjectType({
    name: 'ImageBannerCommonType',
    fields: {
        result: { 
            type: ImageBannerType
        },
        status: { 
            type: IntType 
        },
        errorMessage: { 
            type: StringType 
        },
    }
});

export default ImageBannerCommonType;