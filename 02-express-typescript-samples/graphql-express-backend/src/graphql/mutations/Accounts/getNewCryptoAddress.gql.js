import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';
import {
  createNewMutation
} from '../../__mutationFormat/createNewMutation';
import schemaTypes from '../../schemaTypes';

export default createNewMutation({
  name: 'getNewCryptoAddress',
  inputFields: {
    userId: {
      type: new GraphQLNonNull(GraphQLID)
    },
    type: {
      type: schemaTypes.CurrencyTypeEnumType
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
    type,
  }) => {

    return {
      status: true,
      user: null
    };
  }
});
