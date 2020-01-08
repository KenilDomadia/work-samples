import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
} from 'graphql';
import CurrencyTypeEnum from '../../Enums/GlobalEnums/CurrencyEnum';

const WalletType = new GraphQLObjectType({
  name: 'Wallet',
  fields: {
    currencyType: {
      type: new GraphQLNonNull(CurrencyTypeEnum)
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    promotionalBalance: {
      type: GraphQLFloat,
      resolve: wallet => wallet.promotionalBalance || 0
    }
  }
});

const AccountType = new GraphQLObjectType({
  name: 'Account',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: account => (account._id)
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    wallets: {
      type: new GraphQLList(WalletType)
    }
  }
});

export default AccountType;
