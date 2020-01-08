import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLString
} from 'graphql';
import {
  createNewMutation
} from '../../__mutationFormat/createNewMutation';
import schemaTypes from '../../schemaTypes';

export default createNewMutation({
  name: 'askOrder',
  inputFields: {
    userId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    currencyType: {
      type: new GraphQLNonNull(schemaTypes.CurrencyTypeEnumType)
    },
    amount: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    rate: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    comissionRate: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    taxRate: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    units: {
      type: new GraphQLNonNull(GraphQLFloat)
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
  mutateAndGetPayload: async (root, input) => {
    await validateInput(input);
    return {
      status: true,
      user: null
    };
  }
});
