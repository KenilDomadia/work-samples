import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLString
} from 'graphql';
import {
  createNewMutation
} from '../../__mutationFormat/createNewMutation';
import {
  validateInput,
  purchaseOrder
} from '../../mutationHelper/Order/purchaseOrder';
import schemaTypes from '../../schemaTypes';

export default createNewMutation({
  name: 'purchaseOrder',
  inputFields: {
    userId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    targetCurrency: {
      type: new GraphQLNonNull(schemaTypes.CurrencyTypeEnumType)
    },
    sourceCurrency: {
      type: new GraphQLNonNull(schemaTypes.CurrencyTypeEnumType)
    },
    debitQuantity: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    rate: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    commissionRate: {
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
    },
    order: {
      type: schemaTypes.OrderType,
      resolve: payload => payload.order
    }
  },
  mutateAndGetPayload: async (root, input) => {
    try {
      for (let i = 0; i < 6; i += 1) {
        try {
          const {
            account,
            user
          } = await validateInput(input);
          const order = await purchaseOrder(input, account);
          return {
            status: true,
            order,
            user
          };
        } catch (err) {
          if (err.name === 'ERR_CONCURRENT_ACCESS' && i < 5) {
            continue;
          } else {
            throw new Error('order could not processed because' + err);
          }
        }
      }
    } catch (err) {
      console.error('error in purchase order mutation', err);
      throw Error(err);
    }
  }
});
