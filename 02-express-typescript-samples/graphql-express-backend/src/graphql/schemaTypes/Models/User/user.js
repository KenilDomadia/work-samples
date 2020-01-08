import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import AccountDataLoader from '../../../../common/Dataloaders/account';
import OrderDataLoader from '../../../../common/Dataloaders/order';
import OrderStatusEnumType from '../../Enums/Order/OrderStatusEnum';
import OrderTypeEnumType from '../../Enums/Order/OrderTypeEnum';
import UserStatusEnumType from '../../Enums/User/UserStatusEnum';
import AccountType from '../Account/account';
import OrderType from '../Order/order';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: user => user._id
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    cell: {
      type: new GraphQLNonNull(GraphQLString)
    },
    firstName: {
      type: GraphQLString
    },
    gender: {
      type: GraphQLString
    },
    lastName: {
      type: GraphQLString
    },
    birthDate: {
      type: GraphQLString
    },
    lastActiveOn: {
      type: GraphQLString
    },
    countryCode: {
      type: GraphQLString
    },
    country: {
      type: GraphQLString
    },
    status: {
      type: new GraphQLNonNull(UserStatusEnumType)
    },
    emailVerified: {
      type: GraphQLBoolean
    },
    cellVerified: {
      type: GraphQLBoolean
    },
    kycVerified: {
      type: GraphQLBoolean
    },
    // derived fields
    account: {
      type: AccountType,
      resolve: user => AccountDataLoader.loadAccountByUserId.load(user._id)
    },
    orders: {
      args: {
        orderType: {
          type: OrderTypeEnumType,
          defaultValue: null
        },
        orderStatus: {
          type: OrderStatusEnumType,
          defaultValue: null
        }
      },
      type: new GraphQLList(OrderType),
      resolve: async (user, {
        orderType,
        orderStatus
      }) => {
        // can be optimised by creating a dataloader query that takes a query object istead of just a userId
        let Order = await OrderDataLoader.loadOrdersByUserId.load(user._id) || [];
        if (orderType) {
          Order = Order.filter(order => order.type === orderType);
        }
        if (orderStatus) {
          Order = Order.filter(order => order.status === orderStatus);
        }
        return Order;
      }
    }
  }
});

export default UserType;
