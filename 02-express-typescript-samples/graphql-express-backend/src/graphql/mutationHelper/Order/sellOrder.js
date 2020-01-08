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

// I was thinking at that moment to merge purchase and sell order into single mutation and making it generic and was yet to think whether it would be good idea... so you can continue from there

/**
 * @param  {object} input
 * validates input of make Internal transaction 
 */
export async function validateInput({
  rate,
  sourceCurrency,
  targetCurrency,
  userId
}) {
  try {
    if (sourceCurrency === targetCurrency) {
      throw new Error('source currency and target currency same');
    }
    if (Object.values(SupportedCurrency).indexOf(sourceCurrency) < 0) {
      throw new Error(sourceCurrency, 'not supported yet');
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
    // console.log('zebpay', zebpayRates);
    zebpayRates.sell = 391598.00;
    if (rate > zebpayRates.sell) {
      throw new Error('rates changed');
    }
    return {
      account,
      user
    };
  } catch (err) {
    console.error('error in validating input for sell order', err);
    throw Error(err);
  }
}

export async function sellOrder({
  commissionRate,
  creditQuantity,
  rate,
  sourceCurrency,
  targetCurrency,
  taxRate,
  userId
}, account) {
  try {
    const sourceWalletIndex = getIndexOfWallet(account.wallets, sourceCurrency);
    const targetWalletIndex = getIndexOfWallet(account.wallets, targetCurrency);
    let debitQuantity = creditQuantity / rate;
    debitQuantity *= (1 + (commissionRate * (1 + taxRate)));
    if (!account.wallets[sourceWalletIndex]) {
      throw new Error('user doesn\'t have the source currency wallet');
    } else if (account.wallets[sourceWalletIndex].balance < debitQuantity) {
      throw new Error('not enough balance to sell');
    }
    // deduct balance
    account.wallets[sourceWalletIndex].balance -= debitQuantity;
    // add units
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
      type: OrderModel.OrderTypeEnum.SELL,
      userId
    });
    return order;
  } catch (err) {
    console.error('error in creating a sell order', err);
    throw Error(err);
  }
}
