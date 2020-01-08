import { Types, DocumentInterfaces } from './identifiers';
import * as responseError from './common/responseError';

interface ISetsendNotificationRequest {
    notificationChannelMetadata: DocumentInterfaces.INotificationChannelMetadata;
}

export default async function sendNotification(request: ISetsendNotificationRequest): Promise<any> {
    // call endpoint sendNotification
    try { 
        const body = {
            notificationChannelMetadata: request.notificationChannelMetadata
        };
        const url = `${Types.BACKEND_URL}/sendNotification`;
        const urlResponse = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response = await urlResponse.json();
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
