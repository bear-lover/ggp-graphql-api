import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
	GraphQLInt as IntType,
} from 'graphql';

const DeleteUserType = new ObjectType({
  name: 'DeleteUser',
  fields: {
    userId: { type: new NonNull(StringType) },
    status: { type: IntType },
    errorMessage: { type: StringType },
  },
});

export default DeleteUserType;
