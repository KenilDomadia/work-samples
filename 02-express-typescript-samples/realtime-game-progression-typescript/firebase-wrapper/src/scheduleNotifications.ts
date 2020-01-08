import * as responseError from './common/responseError';
import filterUndefinedKeys from './common/filterUndefinedKeys';
import { DocumentInterfaces, Types } from './identifiers';
import { app } from './app';
import * as _ from 'lodash';
import uuidv4 from 'uuidv4';

interface ISetNotificationRequestUserPreference {
    firstName: string;
    lastName: string;
    endTime: string;
    startTime: string;
    time: string;
    // timeZone is time difference between UTC time and local time, in minutes.
    // For example, If your time zone is GMT + 2, use -120.
    // new Date().getTimezoneOffset();
    timeZone: number;
    days: number[];
}
interface ISetNotificationRequest {
    notificationChannelMetadata: DocumentInterfaces.INotificationChannelMetadata;
    groupId: string;
    userPreference: ISetNotificationRequestUserPreference;
}
export default async function scheduleNotifications(request: ISetNotificationRequest): Promise<any> {
    try {
        const { notificationChannelMetadata, groupId, userPreference } = request
        const mergedNotificationChannelMetadata = mergeWithDefaultNotificationMetadata(notificationChannelMetadata);
        const timeToSendData = getTimeToSend(userPreference);
        if (timeToSendData && timeToSendData.length > 0) {
            for (const i in timeToSendData) {
                let insertObj = {
                    groupId: groupId,
                    timeToSend: timeToSendData[i],
                    notificationChannelMetadata: mergedNotificationChannelMetadata
                };
                insertObj = filterUndefinedKeys(insertObj);
                await app.firestore.collection('notifications').add(insertObj);
            }
            return { response: 'Your Notification has been scheduled. To disable/stop the Notification schedule, please use setNotificationGroupStatus endpoint' }
        }
        return { response: 'Your Notification has been not scheduled. Request you to check Date and Time' }
    }
    catch (e) {
        console.log(e);
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument, e.message);
    }
}
//Genrate TimeToSend based on StartDate (time), EndDate (time) and days
function getTimeToSend(userPreference: ISetNotificationRequestUserPreference) {
    const timeToSendArr: any = [];
    const currentTime = new Date().toISOString();
    const days = userPreference.days;

    const [hh, mm] = userPreference.time.split(':').map(ele => parseInt(ele));

    let timeToSend = new Date(userPreference.startTime);
    timeToSend.setHours(hh, mm, 0, 0);
    timeToSend.setTime(timeToSend.getTime() - (((timeToSend.getTimezoneOffset() - userPreference.timeZone)) * 60000));

    let endTime = new Date(userPreference.endTime);
    endTime.setHours(hh, mm, 0, 0);
    endTime.setTime(endTime.getTime() - (((endTime.getTimezoneOffset() - userPreference.timeZone)) * 60000));

    if (endTime.toISOString() > currentTime) {
        // create array of timeToSend between startTime and endTime
        while (timeToSend.toISOString() <= endTime.toISOString()) {
            // if time to send is in past, do not schedule reminder
            if (currentTime <= timeToSend.toISOString()) {
                if (days && days.length > 0) {
                    const index = days.indexOf(timeToSend.getDay());
                    if (index !== -1) {
                        timeToSendArr.push(timeToSend.toISOString());
                    }
                } else {
                    timeToSendArr.push(timeToSend.toISOString());
                }
            }
            // increment timeToSend by a day for next iteration
            timeToSend = new Date(timeToSend.setDate(timeToSend.getDate() + 1));
        }
    }
    console.log(timeToSendArr);
    return timeToSendArr;
}
function mergeWithDefaultNotificationMetadata(notificationChannelMetadata: DocumentInterfaces.INotificationChannelMetadata) {
    try {
        const defaultNotificationChannelMetadata: DocumentInterfaces.INotificationChannelMetadata = {
            [Types.NotificationChannels.SMS]: {
                notificationId: uuidv4(),
                contactNumber: null,
                message: null,
                isEnabled: false,
                status: 0
            },
            [Types.NotificationChannels.WHATSAPP]: {
                notificationId: uuidv4(),
                contactNumber: null,
                message: null,
                isEnabled: false,
                status: 0
            },
            [Types.NotificationChannels.MAIL]: {
                notificationId: uuidv4(),
                to: null,
                subject: null,
                body: null,
                isEnabled: false,
                status: 0
            },
            [Types.NotificationChannels.PUSH_NOTIFICATION]: {
                notificationId: uuidv4(),
                title: null,
                to: null,
                body: null,
                click_action: null,
                icon: null,
                isEnabled: false,
                status: 0
            }
        };
        const finalNotificationChannelMetadata = _.merge(defaultNotificationChannelMetadata, notificationChannelMetadata);
        return finalNotificationChannelMetadata;
    }
    catch (e) {
        console.log(e);
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument, e.message);
    }
}
