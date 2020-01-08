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
  name: 'updateCell',
  inputFields: {
    cell: {
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
    cell,
    userId,
  }) => {
    const updatedUser = await updateUser(userId, {
      cell
    });
    return {
      status: true,
      user: updatedUser
    };
  }
});
