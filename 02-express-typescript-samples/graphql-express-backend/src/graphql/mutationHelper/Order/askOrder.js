import {
  AccountModel
} from '../../../common/Models';
import {
  getRates
} from './common';

/**
 * @param  {object} input
 * validates input of make Internal transaction 
 */
export async function validateInput({
  userId,
  currencyType,
  transactionType,
  amount,
  rate,
  comissionRate,
  taxRate,
  units
}) {
  const zebpayRates = await getRates();
  console.log('zebpay', zebpayRates);
  if (transactionType === 'purchase') {
    if (rate !== zebpayRates.buy) {
      throw new Error('rates changed');
    }
  } else if (transactionType === 'sell') {
    if (rate !== zebpayRates.rate) {
      throw new Error('rates changed');
    }
  }
  const account = await AccountModel.find({
    userId: MongoObjectId(userId)
  });
}
