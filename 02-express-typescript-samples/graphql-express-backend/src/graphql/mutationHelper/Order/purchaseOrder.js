import {
  CurrencyTypeEnum,
  SupportedCurrency
} from '../../../common/Enums';
import {
  AccountModel,
  OrderModel,
  UserModel
} from '../../../common/Models';
import {
  getRates
} from './common';

function getIndexOfWallet(wallets, currency) {
  return wallets.findIndex(wallet => wallet.currencyType === currency);
}

/**
 * @param  {object} input
 * validates input of make Internal transaction 
 */
export async function validateInput({
  debitQuantity,
  rate,
  sourceCurrency,
  targetCurrency,
  userId
}) {
  try {
    if (sourceCurrency === targetCurrency) {
      throw new Error('source currency and target currency same');
    }
    if (Object.values(SupportedCurrency).indexOf(targetCurrency) < 0) {
      throw new Error(targetCurrency, 'not supported yet');
    }
    const promises = [];
    promises.push(UserModel.findOne({
      _id: MongoObjectId(userId)
    }));
    promises.push(AccountModel.findOne({
      userId: MongoObjectId(userId)
    }));
    promises.push(getRates());
    const [user, account, zebpayRates] = await Promise.all(promises).catch((err) => {
      console.log('error in validating input promises', err);
      throw Error(err);
    });
    if (!user.kycVerified || !user.status === UserModel.UserStatusEnum.ACTIVE) {
      throw new Error('user not permitted');
    }
    zebpayRates.buy = 391598.00;
    if (rate < zebpayRates.buy) {
      throw new Error('rates changed');
    }
    const sourceWalletIndex = getIndexOfWallet(account.wallets, sourceCurrency);
    if (!account.wallets[sourceWalletIndex]) {
      throw new Error('no source wallet for this user');
    } else if ((account.wallets[sourceWalletIndex].balance + account.wallets[sourceWalletIndex].promotionalBalance) < debitQuantity) {
      throw new Error('not enough balance in wallet');
    }
    return {
      account,
      user
    };
  } catch (err) {
    console.error('error in validating input for purchase order', err);
    throw Error(err);
  }
}

function debitFromAccount({
  account,
  debitQuantity,
  sourceCurrency,
  sourceWalletIndex
}) {
  switch (sourceCurrency) {
    case CurrencyTypeEnum.FIAT:
      if (account.wallets[sourceWalletIndex].promotionalBalance > 0 && account.wallets[sourceWalletIndex].promotionalBalance > debitQuantity) {
        account.wallets[sourceWalletIndex].promotionalBalance -= debitQuantity;
      } else if (account.wallets[sourceWalletIndex].promotionalBalance > 0 && account.wallets[sourceWalletIndex].promotionalBalance <= debitQuantity) {
        const amountLeft = debitQuantity - account.wallets[sourceWalletIndex].promotionalBalance;
        account.wallets[sourceWalletIndex].promotionalBalance = 0;
        account.wallets[sourceWalletIndex].balance -= amountLeft;
      } else {
        account.wallets[sourceWalletIndex].balance -= debitQuantity;
      }
      break;
    default:
      account.wallets[sourceWalletIndex].balance -= debitQuantity;
      break;
  }
  return account;
}

export async function purchaseOrder({
  commissionRate,
  debitQuantity,
  rate,
  sourceCurrency,
  targetCurrency,
  taxRate,
  userId
}, account) {
  try {
    const sourceWalletIndex = getIndexOfWallet(account.wallets, CurrencyTypeEnum.FIAT);
    const targetWalletIndex = getIndexOfWallet(account.wallets, targetCurrency);
    if (targetWalletIndex === -1) {
      throw new Error('user doesn\'t have a targetCurrency wallet for', targetCurrency);
    }
    // Debit
    debitFromAccount({
      account,
      debitQuantity,
      sourceCurrency,
      sourceWalletIndex
    });
    // Credit
    const actualAmount = (1 - (commissionRate * (1 + taxRate))) * debitQuantity;
    const creditQuantity = actualAmount / rate;
    account.wallets[targetWalletIndex].balance += creditQuantity;
    await AccountModel.persistIfVersionMatch(account, {
      wallets: account.wallets
    });
    const order = await OrderModel.create({
      commissionRate,
      creditQuantity,
      debitQuantity,
      rate,
      sourceCurrency,
      status: 'completed',
      targetCurrency,
      taxRate,
      type: OrderModel.OrderTypeEnum.PURCHASE,
      userId
    });
    return order;
  } catch (err) {
    console.error('error in creating a purchase order', err);
    throw Error(err);
  }
}
