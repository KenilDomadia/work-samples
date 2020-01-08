import {
  GraphQLEnumType
} from 'graphql';
import OrderTypeEnum from '../../../../common/Models/Orders/enums/OrderTypeEnum';

export default new GraphQLEnumType({
  name: 'OrderTypeEnum',
  description: 'Type of a order',
  values: {
    ask: {
      value: OrderTypeEnum.ASK
    },
    bid: {
      value: OrderTypeEnum.BID
    },
    purchase: {
      value: OrderTypeEnum.PURCHASE
    },
    sell: {
      value: OrderTypeEnum.SELL
    }
  }
});
