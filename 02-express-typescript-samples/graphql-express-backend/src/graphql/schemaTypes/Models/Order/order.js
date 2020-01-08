import {
  GraphQLFloat,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import CurrencyTypeEnum from '../../Enums/GlobalEnums/CurrencyEnum';
import OrderStatusEnumType from '../../Enums/Order/OrderStatusEnum';
import OrderTypeEnumType from '../../Enums/Order/OrderTypeEnum';

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: {
    userId: {
      type: GraphQLID
    },
    type: {
      type: new GraphQLNonNull(OrderTypeEnumType)
    },
    sourceCurrency: {
      type: new GraphQLNonNull(CurrencyTypeEnum)
    },
    targetCurrency: {
      type: new GraphQLNonNull(CurrencyTypeEnum)
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
    },
    creditQuantity: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    status: {
      type: new GraphQLNonNull(OrderStatusEnumType)
    },
    orderOpenDate: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: order => order.createdAt
    },
    orderCloseDate: {
      type: GraphQLString,
      resolve: order => ((order.status !== 'pending') ? order.updatedAt : '')
    }
  }
});

export default OrderType;
