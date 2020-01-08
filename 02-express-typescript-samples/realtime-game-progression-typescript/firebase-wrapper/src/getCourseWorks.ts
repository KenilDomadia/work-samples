import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces, Types } from './identifiers';

export interface ICourseWorkQueryParams {
    courseId?: string;
    studentId?: string;
    assignorId?: string;
    contentId?: string;
    schoolId?: string;
    courseWorkId?: string;
    dueDateBefore?: string;
}
export default async function getCourseWorksDoc({
    courseId,
    studentId,
    assignorId,
    contentId,
    schoolId,
    courseWorkId,
    dueDateBefore
}: ICourseWorkQueryParams): Promise<DocumentInterfaces.ICourseWorkDoc[]> {
    try {
        let courseWorksRef: firebase.firestore.Query = app.firestore.collection(`courseWorks`);
        if (courseWorkId) {
            const courseWorksSnapshot = await (courseWorksRef as firebase.firestore.CollectionReference)
                .doc(courseWorkId)
                .get();
            const doc = [];
            doc.push({ id: courseWorksSnapshot.id, ...courseWorksSnapshot.data() });
            return doc;
        } else {
            courseWorksRef = courseWorksRef.where('courseWorkState', '==', Types.CourseWorkStates.ACTIVE);
            if (studentId) {
                if (courseId) {
                    console.warn('studentId with courseId filter is not implemented yet');
                    courseWorksRef = courseWorksRef.where('courseId', '==', courseId)
                        .where('assignedStudentIds', 'array-contains', studentId);
                    return await getCourseWorkDocsFromDB(courseWorksRef);
                } else {
                    return await getCourseWorksUsingStudentId(courseWorksRef, { studentId, courseId, assignorId });
                }
            } else {
                if (schoolId) {
                    courseWorksRef = courseWorksRef.where('schoolId', '==', schoolId);
                }
                if (assignorId) {
                    courseWorksRef = courseWorksRef.where('assignorId', '==', assignorId);
                }
                if (courseId) {
                    courseWorksRef = courseWorksRef.where('courseId', '==', courseId);
                }
                if (contentId) {
                    courseWorksRef = courseWorksRef.where('contentId', '==', contentId);
                }
                if (dueDateBefore) {
                    courseWorksRef = courseWorksRef.where('dueDate', '<=', dueDateBefore);
                }
                return await getCourseWorkDocsFromDB(courseWorksRef);
            }
        }

    } catch (e) {
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}

async function getCourseWorksUsingStudentId(courseWorksRef: firebase.firestore.Query, { studentId, courseId, assignorId }) {
    if (courseId) {
        courseWorksRef = courseWorksRef.where('courseId', '==', courseId)
            .where('assignedStudentIds', 'array-contains', studentId)
            .where('assignorId', '==', assignorId);
        return await getCourseWorkDocsFromDB(courseWorksRef);
    } else {
        courseWorksRef = courseWorksRef.where('assignedStudentIds', 'array-contains', studentId)
            .where('assignorId', '==', assignorId);
        return await getCourseWorkDocsFromDB(courseWorksRef);
    }
}

async function getCourseWorkDocsFromDB(courseWorksRef: firebase.firestore.Query) {
    const querySnapshot = await courseWorksRef.get();
    const docs = [];
    for (const doc of querySnapshot.docs) {
        docs.push({ id: doc.id, ...doc.data() });
    }
    return docs;
}
