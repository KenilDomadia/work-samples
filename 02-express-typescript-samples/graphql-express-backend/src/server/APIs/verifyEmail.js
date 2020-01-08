import {
  UserModel
} from '../../common/Models/';

const jwt = require('jsonwebtoken');

export default async function verifyEmail(verificationToken) {
  try {
    const result = jwt.verify(verificationToken, process.env.JWT_SECRET);
    console.log('result of verifying jwt token', result);
    const user = await UserModel.findOneAndUpdate({
      _id: result.userId
    }, {
      $set: {
        emailVerified: true
      }
    }, {
      new: true
    });
    console.log('user after email verification', user);
    return true;
  } catch (error) {
    console.error('error in verifyEmail.js', error);
    return false;
  }
}
