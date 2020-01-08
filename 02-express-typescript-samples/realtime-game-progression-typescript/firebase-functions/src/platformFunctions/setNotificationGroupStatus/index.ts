import { responseError } from '../../common';
import { IncomingRequest } from '../../common/TypesAndIdentifiers';
import { setNotificationGroupStatus } from '../../../../utils/src';

export default async (request: IncomingRequest) => {
  try {

    const setNotificationsGroupStatusResponse = await setNotificationGroupStatus(request.body);
    return { setNotificationsGroupStatusResponse };
  }
  catch (e) {
    console.log(e);
    throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument, e.message);
  }
}