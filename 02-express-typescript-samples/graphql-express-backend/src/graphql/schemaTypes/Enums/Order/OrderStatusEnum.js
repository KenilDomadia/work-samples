import {
  GraphQLEnumType
} from 'graphql';
import OrderStatusEnum from '../../../../common/Models/Orders/enums/OrderStatusEnum';

export default new GraphQLEnumType({
  name: 'OrderStatusEnum',
  description: 'Status of a order',
  values: {
    completed: {
      value: OrderStatusEnum.COMPLETED
    },
    failed: {
      value: OrderStatusEnum.FAILED
    }
  }
});
