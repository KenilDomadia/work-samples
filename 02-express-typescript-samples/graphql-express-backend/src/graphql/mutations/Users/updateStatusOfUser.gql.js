import {
  GraphQLString,
  GraphQLBoolean
} from 'graphql';

import schemaTypes from '../../schemaTypes';
import {
  createNewMutation
} from '../../__mutationFormat/createNewMutation';

import {
  updateUser
} from '../../mutationHelper/User/updateUser';

export default createNewMutation({
  name: 'UpdateStatusOfUser',
  inputFields: {
    userId: {
      type: GraphQLString
    },
    status: {
      type: schemaTypes.UserStatusEnumType
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
    userId,
    status
  }) => {
    try {
      const user = await updateUser(userId, {
        status
      });
      return {
        user,
        status: true
      };
    } catch (error) {
      console.error('error in delete a user', error);
      return {
        user: null,
        status: false
      };
    }
  }
});
