import * as responseError from './common/responseError';
import { app, Types } from './app';
import getUsers from './getUsers';
import generateOTP from './generateOTP';
import sendNotification from './sendNotification';
import parseMessageTemplateToString from './parseMessageTemplateToString';

export default async function loginWithContact(
  phoneNumber: string,
  notificationChannels = [Types.NotificationChannels.SMS]
): Promise<any> {
  try {
    const [userData] = await getUsers({ phoneNumber });
    if (!userData) {
      return {
        status: true,
        alreadyExists: false,
        message: 'User not found!'
      };
    } else {
      const otp = await generateOTP({phoneNumber});
      const otpMessage = await parseMessageTemplateToString(Types.MessageTemplates.OTP, [otp.toString()]);

      const notificationObj = {};
      notificationChannels.forEach(notificationChannel => {
        notificationObj[notificationChannel] = {
          contactNumber: phoneNumber,
          message: otpMessage,
          isEnabled: true
        }
      });

      await sendNotification({ notificationChannelMetadata: notificationObj });
      return {
        status: true,
        alreadyExists: true
      };
    }
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
