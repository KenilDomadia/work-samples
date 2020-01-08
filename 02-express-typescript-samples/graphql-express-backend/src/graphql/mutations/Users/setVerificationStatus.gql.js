import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean
} from 'graphql';


import {
  updateUser
} from '../../mutationHelper/User/updateUser';
import { createNewMutation } from '../../__mutationFormat/createNewMutation';
import schemaTypes from '../../schemaTypes';

export default createNewMutation({
  name: 'setVerificationStatus',
  inputFields: {
    userId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    verificationType: {
      type: schemaTypes.UserVerificationTypeEnumType
    },
    status: {
      type: new GraphQLNonNull(GraphQLBoolean)
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
    verificationType,
    status
  }) => {
    switch (verificationType) {
      case 'cell':
        updateUser(userId, {
          cellVerified: status
        });
        break;
      case 'email':
        updateUser(userId, {
          emailVerified: status
        });
        break;
      case 'kyc':
        updateUser(userId, {
          kycVerified: status
        });
        break;
      default:
        console.error('invalid status type');
        throw new Error('invalid status type');
    }
  }
});
