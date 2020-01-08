import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString
} from 'graphql';
import {
  updateUser
} from '../../mutationHelper/User/updateUser';
import {
  createNewMutation
} from '../../__mutationFormat/createNewMutation';
import schemaTypes from '../../schemaTypes';

export default createNewMutation({
  name: 'changeEmail',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    userId: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  outputFields: {
    status: {
      type: GraphQLBoolean,
      resolve: payload => payload.status
    },
    user: {
      type: schemaTypes.UserType,
      resolve: payload => payload.user
    }
  },
  mutateAndGetPayload: async (root, {
    email,
    userId,
  }) => {
    const updatedUser = await await updateUser(userId, {
      email
    });
    return {
      status: true,
      user: updatedUser
    };
  }
});
