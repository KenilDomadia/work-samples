import { app, Types, DocumentInterfaces } from '../../../../utils/src';
import sendSMSUsingSNS from './sendSMSUsingSNS';
import sendWhatsAppMessageUsingTwilio from './sendWhatsAppMessageUsingTwilio';
import sendEmailUsingSES from './sendEmailUsingSES';
import sendPushNotificationUsingFCM from './sendPushNotificationUsingFCM';
import { getNotificationDocs } from '../../../../utils/src/getNotification'
import * as functions from 'firebase-functions';
import { initializeAdminApp } from '../../common';
import * as _ from 'lodash';

enum NotificationChannelsStatus {
  UNSENT,
  SENT
}

const main = async () => {
  const currentTime = new Date().toISOString();
  for (const notificationChannel in Types.NotificationChannels) {
    const notificationRef = app.firestore.collection('notifications')
      .where('timeToSend', '<', currentTime)
      .where(`notificationChannelMetadata.${notificationChannel}.status`, '==', NotificationChannelsStatus.UNSENT)
      .where(`notificationChannelMetadata.${notificationChannel}.isEnabled`, '==', true);
    const notificationDocs = await getNotificationDocs(notificationRef);

    const chunksOf499 = _.chunk(notificationDocs, 499);
    for (const singleChunk of chunksOf499) {
      await sendPendingNotifications(singleChunk);
    }
  }
  console.log('Function Execution complete');
}

async function sendPendingNotifications(notificationDocs) {
  const promises = [];
  const batch = app.firestore.batch();
  for (const notificationDoc of notificationDocs) {
    const notificationChannelMetadata = notificationDoc.notificationChannelMetadata;
    const docId = notificationDoc.id;
    const notificationsDocRef = app.firestore.collection('notifications').doc(docId);
    const updateObj = {};

    for (const notificationChannel in Types.NotificationChannels) {
      const isChannelEnabled = notificationChannelMetadata[notificationChannel].isEnabled;
      const channelStatus = notificationChannelMetadata[notificationChannel].status;
      if (isChannelEnabled && channelStatus === NotificationChannelsStatus.UNSENT) {
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
        updateObj[`notificationChannelMetadata.${notificationChannel}.status`] = NotificationChannelsStatus.SENT;
      }
    }
    if (!_.isEmpty(updateObj)) {
      batch.update(notificationsDocRef, updateObj);
    }
  }
  await batch.commit();

  const allPromiseData: DocumentInterfaces.ISendNotificationResponse[] = await Promise.all(promises);
  await addNotificationAuditLogs(allPromiseData);
}

async function addNotificationAuditLogs(sendNotificationResponses: DocumentInterfaces.ISendNotificationResponse[]) {
  const chunksOf499 = _.chunk(sendNotificationResponses, 499);
  for (const singleChunk of chunksOf499) {
    const batch = app.firestore.batch();
    for (const promiseData of singleChunk) {
      const auditLogDocRef = app.firestore.collection('notificationAuditLogs').doc();
      batch.set(auditLogDocRef, promiseData.data);
    }
    await batch.commit();
  }
}

export default functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
  console.log('Function Execution start');
  app.initializeApp(initializeAdminApp.default);
  await main();
  return {};
});



