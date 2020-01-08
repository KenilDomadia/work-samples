import CurrencyTypeEnum from '../../../common/Enums/CurrencyTypeEnum';

export async function createWallet(userId, type) {
  switch (type) {
    case CurrencyTypeEnum.BTC:
      // return getNewBTCWallet();
      console.log('gdvgdsvgdjshgvjhsdgvj');
      break;
    case CurrencyTypeEnum.BCH:
      console.log('dgchdgvjhdsgvjhsdgv');
      break;
    case CurrencyTypeEnum.ETH:
      console.log('jskhkjsadhvkasjhvaks');
      break;
  }
}
