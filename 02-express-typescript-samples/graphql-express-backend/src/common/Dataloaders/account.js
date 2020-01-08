import Dataloader from 'dataloader';
import {
  AccountModel
} from '../Models/';

module.exports.loadAccountByUserId = new Dataloader(userIds => new Promise(async (resolve, reject) => {
  try {
    const accounts = await AccountModel.find({
      userId: {
        $in: userIds.map(userId => MongoObjectId(userId))
      }
    }).exec();
    const accountsMap = [];
    accounts.forEach((account) => {
      accountsMap[account.userId.toString()] = account;
      return null;
    });
    resolve(userIds.map(userId => accountsMap[userId]));
  } catch (err) {
    console.error('error in batch loading accounts', err);
    reject(err);
  }
}));
