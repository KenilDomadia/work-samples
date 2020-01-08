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

import  {
  validateInput
} from '../../mutationHelper/Order/bidOrder';

export default createNewMutation({
  name: 'bidOrder',
  inputFields: {
    userId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    sourceCurrency: {
      type: new GraphQLNonNull(schemaTypes.CurrencyTypeEnumType)
    },
    targetCurrency: {
      type: new GraphQLNonNull(schemaTypes.CurrencyTypeEnumType)
    },
    creditQuantity: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    debitQuantity: {
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
