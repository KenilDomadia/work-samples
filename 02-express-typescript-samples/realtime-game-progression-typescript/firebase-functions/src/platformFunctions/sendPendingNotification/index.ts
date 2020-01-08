import { responseError } from '../../common';
import sendPendingNotifications from '../../pubsubFunctions/sendPendingNotifications'
import { IncomingRequest } from '../../common/TypesAndIdentifiers';

export default async (request: IncomingRequest) => {
  try {
    const setNotificationsResponse = await sendPendingNotifications(request.body);
    return { setNotificationsResponse };
  }
  catch (e) {
    console.log(e);
    throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument, e.message);
  }
}