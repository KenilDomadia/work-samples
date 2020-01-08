import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces } from './identifiers';

export default async function addTrialLog(trialLog: any) {
    try {
        const docRef = await app.firestore.collection(`trialLogs`).add(trialLog);
        return { id: docRef.id };
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
