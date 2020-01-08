import * as responseError from './common/responseError';
import { app } from './app';

export interface IGenerateOTPQuery {
  phoneNumber?: string,
  email?: string
}

export default async function generateOTP(otpCredInfo: IGenerateOTPQuery): Promise<number> {
  try {
    const {phoneNumber, email} = otpCredInfo;
    if(phoneNumber) {
      const existingOTP = await app.firestore.collection('otp').where('phoneNumber', '==', phoneNumber).get();
      if (existingOTP.empty) {
        let otp = Math.floor(Math.random() * 1000000);
        if (otp < 100000) { otp += 100000; }
        await app.firestore.collection('otp').add({
          phoneNumber,
          otp
        });
        return otp;
      } else {
        const existingDoc = existingOTP.docs[0].data();
        return existingDoc.otp;
      }
    } else if(email) {
      const existingOTP = await app.firestore.collection('otp').where('email', '==', email).get();
      if (existingOTP.empty) {
        let otp = Math.floor(Math.random() * 1000000);
        if (otp < 100000) { otp += 100000; }
        await app.firestore.collection('otp').add({
          email,
          otp
        });
        return otp;
      } else {
        const existingDoc = existingOTP.docs[0].data();
        return existingDoc.otp;
      }
    } else {
      throw new Error('Invalid parameters');
    }
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}