import * as responseError from './common/responseError';
import { app } from './app';
import getUsers from './getUsers';
import { DocumentInterfaces, Types } from './identifiers';
import sendNotification from './sendNotification';
import parseMessageTemplateToString from './parseMessageTemplateToString';

export default async function addFeedback(userId: string, metadata: {
    message: string,
    pageName?: string
    rating?: number
}): Promise<any> {
    try {
        const insertObj = {
            userId,
            message: metadata.message,
            pageName: metadata.pageName || null,
            rating: metadata.rating || null
        };
        const [userData] = await getUsers({ userId });
        await app.firestore.collection('feedback').add(insertObj);

        const notificationObj: DocumentInterfaces.INotificationChannelMetadata = {};
        const userContactDetail = userData.primaryNumber ? userData.primaryNumber : userData.email;
        const otpMessage = await parseMessageTemplateToString(Types.MessageTemplates.TEMPLATE_12, [userContactDetail]);
        notificationObj[Types.NotificationChannels.WHATSAPP] = {
            contactNumber: '+919974006608',
            message: otpMessage,
            isEnabled: true
        } as any;
        await sendNotification({ notificationChannelMetadata: notificationObj });

        return {
            status: true
        }
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}