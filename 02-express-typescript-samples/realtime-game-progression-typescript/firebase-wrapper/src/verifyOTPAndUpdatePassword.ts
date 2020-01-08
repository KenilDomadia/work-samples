import * as responseError from './common/responseError';
import getUsers from './getUsers';
import updateUser from './updateUser';
import { app } from './app';

export default async function verifyOTPAndUpdatePassword(
  email: string,
  password: string,
  confirmPassword: string,
  code: string,
): Promise<any> {
  try {

    // Error if password and confirmPassword doesn't match
    if (password !== confirmPassword) {
      throw new Error('Confirm password does not match password.');
    }

    if (password.length < 6) {
      throw new Error('Password should be at least 6 characters');
    }

    const otp = Number.parseInt(code);
    const otpDoc = await app.firestore
      .collection('otp')
      .where('otp', '==', otp)
      .where('email', '==', email)
      .get();

    if (otpDoc.empty) {
        throw new Error('Invalid OTP');
    } else {
        // delete otp-doc from firestore
        await app.firestore.collection('otp').doc(otpDoc.docs[0].id).delete();

        let [userData] = await getUsers({ email });
        if (userData) {
            // update password for user
            await updateUser(userData.id, {
                password: confirmPassword
            });
            return {
                passwordResetStatus: true,
            };
        } else {
            throw new Error('User not found!');
        }
    }
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}