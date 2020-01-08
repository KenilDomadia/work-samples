import * as responseError from './common/responseError';
import { app, Types } from './app';
import getUsers from './getUsers';
import { generateOTPAndSend } from './generateOTPAndSend';

export default async function signUpWithContactNumber(
  phoneNumber: string,
  userId?: string,
  notificationChannels = [Types.NotificationChannels.SMS]
): Promise<any> {
  try {
    const [userData] = await getUsers({ phoneNumber });
    if (userData) {
      if (userId === userData.id) {
        await generateOTPAndSend(phoneNumber, notificationChannels);
        return {
          status: true,
          alreadyExists: true
        };
      } else {
        throw new Error('User already exists!');
      }
    } else {
      await generateOTPAndSend(phoneNumber, notificationChannels);
      return {
        status: true,
        alreadyExists: false
      };
    }
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
