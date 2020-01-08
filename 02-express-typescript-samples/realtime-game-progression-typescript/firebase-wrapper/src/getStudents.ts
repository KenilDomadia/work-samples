import * as responseError from './common/responseError';
import { app } from './app';
export interface IStudentsQueryParams {
    courseId?: string;
    studentId?: string;
    teacherId?: string;
}

export default async function getStudents(requestData: Partial<IStudentsQueryParams>): Promise<any[]> {
    try {
        const usersRef = app.firestore.collection('users') as firebase.firestore.CollectionReference;
        let userDocs;
        let results;
        if (requestData.courseId) {
            userDocs = await usersRef.where('courseId', '==', requestData.courseId).get();
            results = userDocs.docs.map(userDoc => {
                return { id: userDoc.id, ...userDoc.data() };
            });
        } else if (requestData.studentId) {
            userDocs = await usersRef.doc(requestData.studentId).get();
            results = [{ id: userDocs.id, ...userDocs.data() }];
        }
        return results;
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
