import Dataloader from 'dataloader';
import {
  OrderModel
} from '../Models/';

module.exports.loadOrdersByUserId = new Dataloader(userIds => new Promise(async (resolve, reject) => {
  try {
    const orders = await OrderModel.find({
      userId: {
        $in: userIds.map(userId => MongoObjectId(userId))
      }
    }).sort('-createdAt').lean().exec();
    const ordersMap = [];
    orders.forEach((order) => {
      if (ordersMap[order.userId.toString()]) {
        ordersMap[order.userId.toString()].push(order);
      } else {
        ordersMap[order.userId.toString()] = [order];
      }
      return null;
    });
    resolve(userIds.map(userId => ordersMap[userId]));
  } catch (err) {
    console.error('error in batch loading orders', err);
    reject(err);
  }
}));
