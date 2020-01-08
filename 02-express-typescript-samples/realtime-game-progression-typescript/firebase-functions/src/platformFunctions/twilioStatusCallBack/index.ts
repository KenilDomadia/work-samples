import { IncomingRequest } from '../../common/TypesAndIdentifiers';
import { responseError, initializeAdminApp } from '../../common';
import { app } from '../../../../utils/src';

export default async (request: IncomingRequest) => {
    try {
        app.initializeApp(initializeAdminApp.default);
        const data = request.body;
        console.log('data', data);
    }
    catch (e) {
        console.log(e);
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument, e.message);
    }
}