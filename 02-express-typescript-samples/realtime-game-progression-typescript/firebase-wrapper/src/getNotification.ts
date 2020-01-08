import { DocumentInterfaces } from './identifiers/DocumentInterfaces';


export async function getNotificationDocs(notificationRef: firebase.firestore.Query): Promise<DocumentInterfaces.ISetNotificationRequest[]> {
    const notifications = [];
    const allNotifications = await notificationRef.get();
    allNotifications.forEach(notificationDoc => {
        notifications.push({ id: notificationDoc.id, ...notificationDoc.data() })
    });
    return notifications;
}