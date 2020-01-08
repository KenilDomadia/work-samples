import * as responseError from './common/responseError';
import { generateOTPAndSend } from './generateOTPAndSend';
import { Types } from './identifiers';

export default async function resendOTP(
  phoneNumber: string,
  notificationChannels = [Types.NotificationChannels.SMS]
): Promise<any> {
  try {
    await generateOTPAndSend(phoneNumber, notificationChannels);
    return {
      status: true,
      message: `OTP resent successfully to number: ${phoneNumber}`
    }
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}