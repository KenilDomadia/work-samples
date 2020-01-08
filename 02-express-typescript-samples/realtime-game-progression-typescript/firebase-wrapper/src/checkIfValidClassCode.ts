import * as responseError from './common/responseError';
import { app } from './app';

export default async function checkIfValidClassCode(classCode: string): Promise<boolean> {
    try {
        let courseRef = app.firestore.collection('courses') as firebase.firestore.Query;
        if (classCode) {
            courseRef = courseRef.where('enrollmentCode', '==', classCode.toUpperCase());
            const courseDocs = await courseRef.get();
            return !courseDocs.empty;
        } else {
            return false;
        }
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            'Error checking class code.',
            e.message
        );
    }
}
