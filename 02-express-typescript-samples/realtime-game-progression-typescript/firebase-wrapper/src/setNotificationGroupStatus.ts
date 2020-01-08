import { DocumentInterfaces, Types } from './identifiers';
import { app } from './app';
import { getNotificationDocs } from './getNotification';
import * as _ from 'lodash';

enum NotificationChannelsStatus {
    UNSENT,
    SENT
}

interface IsetNotificationGroupStatusRequest {
    groupId: string;
    notificationChannels?: Types.NotificationChannels[];
    isEnabled: boolean;
}
export default async function setNotificationGroupStatus(request: IsetNotificationGroupStatusRequest): Promise<any> {
    const { groupId, notificationChannels = [], isEnabled } = request;

    // push all channels, if the incoming request doesn't specify
    if (!notificationChannels || notificationChannels.length === 0) {
        for (const notificationChannel in Types.NotificationChannels) {
            notificationChannels.push(notificationChannel as Types.NotificationChannels);
        }
    }

    // update isEnabled value for all eligible docs
    for (const notificationChannel of notificationChannels) {
        const notificationsRef = app.firestore.collection('notifications')
            .where('groupId', '==', groupId)
            .where(`notificationChannelMetadata.${notificationChannel}.isEnabled`, '==', !isEnabled)
            .where(`notificationChannelMetadata.${notificationChannel}.status`, '==', NotificationChannelsStatus.UNSENT)
        const notificationDocs = await getNotificationDocs(notificationsRef);

        const chunksOf499 = _.chunk(notificationDocs, 499);
        for (const singleChunk of chunksOf499) {
            await updatePendingNotificationsStatus(singleChunk, isEnabled, notificationChannels);
        }
    }
    console.log('Function Execution complete : Record Updated Successfully');
    return { message: 'Record Updated Successfully' }
}

async function updatePendingNotificationsStatus(notificationDocs: DocumentInterfaces.ISetNotificationRequest[], isEnabled: boolean, notificationChannels: Types.NotificationChannels[]) {
    const batch = app.firestore.batch();

    for (const i in notificationDocs) {
        const updateObj = {};
        notificationChannels.forEach(notificationChannel => {
            updateObj[`notificationChannelMetadata.${notificationChannel}.isEnabled`] = isEnabled;
        });
        const notificationDoc = notificationDocs[i];
        const docId = notificationDoc.id;
        const docRef = app.firestore.collection('notifications').doc(docId);
        batch.update(docRef, updateObj);
    }
    await batch.commit();
}