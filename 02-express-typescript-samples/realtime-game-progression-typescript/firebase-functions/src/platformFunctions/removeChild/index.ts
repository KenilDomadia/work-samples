import * as adminUtils from '../../admin-utils';
import { responseError } from '../../common';
import { IncomingRequest} from '../../common/TypesAndIdentifiers';

export default async (request: IncomingRequest) => {
    const { childId } = request.body;

    try {
        return await adminUtils.removeChild(childId);
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
