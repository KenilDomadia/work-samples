
import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces } from './identifiers';

export default async function addStudentStateDoc({
    studentId,
    courseId,
    state = {}
}: Partial<DocumentInterfaces.IStudentStateDoc>): Promise<DocumentInterfaces.IStudentStateDoc> {
    try {
        const data = {
            studentId,
            courseId,
            state
        };
        const docRef = await app.firestore.collection(`studentStates`).add(data);
        console.log('Document written with ID: ', docRef.id);
        return { id: docRef.id, ...data };
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
