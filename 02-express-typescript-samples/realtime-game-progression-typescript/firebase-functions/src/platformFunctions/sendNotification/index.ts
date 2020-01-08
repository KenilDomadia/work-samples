import { responseError } from '../../common';
import { Types, DocumentInterfaces } from '../../../../utils/src';
import { IncomingRequest } from '../../common/TypesAndIdentifiers';
import sendSMSUsingSNS from '../../pubsubFunctions/sendPendingNotifications/sendSMSUsingSNS';
import sendEmailUsingSES from '../../pubsubFunctions/sendPendingNotifications/sendEmailUsingSES';
import sendPushNotificationUsingFCM from '../../pubsubFunctions/sendPendingNotifications/sendPushNotificationUsingFCM';
import sendWhatsAppMessageUsingTwilio from '../../pubsubFunctions/sendPendingNotifications/sendWhatsAppMessageUsingTwilio';

export default async (request: IncomingRequest) => {
    try {
        const { notificationChannelMetadata } = request.body;
        const promises = [];
        for (const notificationChannel in notificationChannelMetadata) {
            const isChannelEnabled = notificationChannelMetadata[notificationChannel].isEnabled;
            if (isChannelEnabled) {
                const channelMetadata = notificationChannelMetadata[notificationChannel];
                let sendNotificationPromise: Promise<DocumentInterfaces.ISendNotificationResponse>;
                switch (notificationChannel) {
                    case Types.NotificationChannels.SMS:
                        sendNotificationPromise = sendSMSUsingSNS(channelMetadata);
                        break;
                    case Types.NotificationChannels.MAIL:
                        sendNotificationPromise = sendEmailUsingSES(channelMetadata);
                        break;
                    case Types.NotificationChannels.PUSH_NOTIFICATION:
                        sendNotificationPromise = sendPushNotificationUsingFCM(channelMetadata);
                        break;
                    case Types.NotificationChannels.WHATSAPP:
                        sendNotificationPromise = sendWhatsAppMessageUsingTwilio(channelMetadata);
                        break;
                    default:
                        console.log('Unidentified notification channel : ', notificationChannel);
                }
                promises.push(sendNotificationPromise);
            }
        }
        const allPromiseData: DocumentInterfaces.ISendNotificationResponse[] = await Promise.all(promises);
        return { allPromiseData };
    }
    catch (e) {
        console.log(e);
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument, e.message);
    }
}