import {
  AccountModel
} from '../../../common/Models/';

export async function createAccountForUser(user) {
  await AccountModel.create({
    userId: user._id,
    wallets: [{
      currencyType: AccountModel.CurrencyTypeEnum.FIAT,
      balance: 0
    }]
  });
}
