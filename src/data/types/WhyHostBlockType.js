import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from 'graphql';

const WhyHostBlockType = new ObjectType({
  name: 'WhyHost',
  fields: {
    id: { type: StringType },
    title: { type: StringType },
    name: { type: StringType },
    value: { type: StringType },
    status: { type: IntType }
  },
});

export default WhyHostBlockType;
