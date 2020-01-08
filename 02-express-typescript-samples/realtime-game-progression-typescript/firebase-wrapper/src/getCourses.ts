import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces } from './identifiers';

export interface ICourseQueryParams {
    teacherId: string;
    enrollmentCode: string;
    depricated: boolean;
    courseId: string;
    studentId: string;
    schoolId: string;
}
export default async function getCourses({
    teacherId,
    enrollmentCode,
    depricated,
    courseId,
    studentId,
    schoolId
}: Partial<ICourseQueryParams>): Promise<DocumentInterfaces.ICourseDoc[]> {

    try {
        let courseRef: any = app.firestore.collection('courses');

        if (courseId) {
            return await getCourseDoc(courseRef, courseId);
        } else {
            if (studentId) {
                courseRef = courseRef.where('students', 'array-contains', studentId);
            }
            if (schoolId) {
                courseRef = courseRef.where('schoolId', '==', schoolId);
            }
            if (teacherId) {
                courseRef = courseRef.where('teacherId', '==', teacherId);
            }
            if (enrollmentCode) {
                courseRef = courseRef.where(
                    'enrollmentCode',
                    '==',
                    enrollmentCode
                );
            }
            const querySnapshot = await courseRef.get();
            const courses = [];
            querySnapshot.forEach(doc => {
                courses.push({ ...doc.data(), id: doc.id });
            });
            return courses;
        }

    } catch (e) {
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}

async function getCourseDoc(courseRef: any, courseId: string) {
    const doc = await courseRef.doc(courseId).get();
    return doc.data() ? [{ ...doc.data(), id: doc.id }] : [];
}

