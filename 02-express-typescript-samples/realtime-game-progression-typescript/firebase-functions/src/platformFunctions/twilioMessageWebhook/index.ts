import { IncomingRequest } from '../../common/TypesAndIdentifiers';
import { responseError, initializeAdminApp } from '../../common';
import { app, Types, updateParentState, getUsers, getParentState, parseMessageTemplateToString } from '../../../../utils/src';
import * as twilio from 'twilio';
import { Response } from 'express';

enum UserReplies {
    STOP = 'STOP',
    START = 'START'
}
export default async (request: IncomingRequest, res: Response) => {
    try {
        app.initializeApp(initializeAdminApp.default);
        const twiml = new twilio.twiml.MessagingResponse();
        const data = request.body;
        const msg = data.Body.toString().toUpperCase();
        const whatsappFrom = data.From.split(':');
        const from = whatsappFrom[1];
        const currentTime = new Date().toISOString();
        const [userResponse] = await getUsers({ phoneNumber: from })
        const parentStates = await getParentState({ userId: userResponse.id })
        const parentStateReminders = parentStates.reminders;
        switch (msg) {
            case UserReplies.STOP:
                if (parentStateReminders.length > 0) {
                    for (const parentStateReminder of parentStateReminders) {
                        if (parentStateReminder.notificationChannelMetadata.WHATSAPP.contactNumber === from) {
                            parentStateReminder.notificationChannelMetadata.WHATSAPP.isEnabled = false;
                            const activeReminderStopMessage = await parseMessageTemplateToString(Types.MessageTemplates.ALERT_STOPPED_IF_ACTIVE_REMINDER, []);
                            twiml.message(activeReminderStopMessage);
                        }
                    }
                }
                else {
                    const noReminderStopMessage = await parseMessageTemplateToString(Types.MessageTemplates.ALERT_STOPPED_IF_NOREMINDER, ['https://factflow.io/account']);
                    twiml.message(noReminderStopMessage);
                }
                await updateParentState(parentStates);
                break;
            case UserReplies.START:
                for (const parentStateReminder of parentStateReminders) {
                    if (parentStateReminder.userPreference.endTime >= currentTime &&
                        parentStateReminder.notificationChannelMetadata.WHATSAPP.isEnabled === false) {
                        parentStateReminder.userPreference.startTime = currentTime;
                        parentStateReminder.notificationChannelMetadata.WHATSAPP.isEnabled = true;
                        const startMessage = await parseMessageTemplateToString(Types.MessageTemplates.TEMPLATE_4,
                            ['Fact Flow']);
                        twiml.message(startMessage);
                    } else {
                        const startMessage = await parseMessageTemplateToString(Types.MessageTemplates.TEMPLATE_4,
                            ['Fact Flow']);
                        twiml.message(startMessage);
                    }
                }
                await updateParentState(parentStates);
                break;
            default:
                console.log(`Unidentified message reply received from user. ${msg}. From: ${from}`);
                twiml.message(Types.MessageTemplates.DEFAULT_RESPONSE);
        }
        return {
            isXml: true,
            xmlString: twiml.toString()
        };
    }
    catch (e) {
        console.log(e);
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument, e.message);
    }
}