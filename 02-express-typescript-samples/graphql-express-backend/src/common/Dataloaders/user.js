import Dataloader from 'dataloader';
import {
  UserModel
} from '../Models/';

module.exports.loadUserById = new Dataloader(ids => new Promise(async (resolve, reject) => {
  try {
    const users = await UserModel.find({
      _id: {
        $in: ids.map(id => MongoObjectId(id))
      }
    }).exec();
    const usersMap = [];
    users.forEach((user) => {
      usersMap[user._id.toString()] = user;
      return null;
    });
    resolve(ids.map(id => usersMap[id]));
  } catch (err) {
    console.error('error in batch loading users', err);
    reject(err);
  }
}));
