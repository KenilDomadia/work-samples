import {
  GraphQLEnumType
} from 'graphql';
import CurrencyTypeEnum from '../../../../common/Enums/CurrencyTypeEnum';

export default new GraphQLEnumType({
  name: 'CurrencyTypeEnum',
  description: 'Type of Currency',
  values: {
    fiat: {
      value: CurrencyTypeEnum.FIAT
    },
    bitcoin: {
      value: CurrencyTypeEnum.BTC
    },
    ethereum: {
      value: CurrencyTypeEnum.ETH
    },
    bitcoin_cash: {
      value: CurrencyTypeEnum.BCH
    }
  }
});
