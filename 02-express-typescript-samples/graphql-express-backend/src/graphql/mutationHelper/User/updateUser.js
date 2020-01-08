import {
  UserModel
} from '../../../common/Models/';

export async function updateUser(userId, updateObject) {
  return UserModel.findOneAndUpdate({
    _id: MongoObjectId(userId)
  }, {
    $set: {
      ...updateObject
    }
  }, {
    new: true
  });
}
