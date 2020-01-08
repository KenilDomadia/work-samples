import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces, Types } from './identifiers';
import updateUser from './updateUser';
import updateCourseWork from './updateCourseWork';

export default async function addCourseWorks(courseWorkDocs: Partial<DocumentInterfaces.ICourseWorkDoc>[]) {
    try {
        const batch = app.firestore.batch();
        const courseWorkRef = app.firestore.collection('courseWorks');
        let userDocs: any[] = [];

        await Promise.all(courseWorkDocs.map(async courseWork => {
            const {
                title,
                assigneeMode,
                contentId,
                courseId,
                assignorId,
                schoolId,
                scheduledDate = new Date(0).toISOString(),
                dueDate = new Date(0).toISOString(),
                assignedStudentIds = [],
                description = '',
                maxPoints = 0,
                courseWorkState = Types.CourseWorkStates.ACTIVE,
            } = courseWork;
            const courseWorkDoc = await courseWorkRef.where('contentId', '==', contentId)
                .where('courseId', '==', courseId)
                .where('assignorId', '==', assignorId)
                .get();
            if (courseWorkDoc.empty) {
                const docRef = courseWorkRef.doc();
                batch.set(docRef, {
                    title,
                    assigneeMode,
                    contentId,
                    courseId,
                    assignorId,
                    schoolId,
                    scheduledDate,
                    dueDate,
                    assignedStudentIds,
                    description,
                    maxPoints,
                    courseWorkState
                });
                const courseWork = {
                    id: docRef.id,
                    contentId,
                    title
                };
                userDocs = await updateUserDocs(assignedStudentIds, courseWork);
                console.log('Document written with ID: ', docRef.id);
            } else {
                const courseWorkId = courseWorkDoc.docs[0].id;
                const courseWorkData = courseWorkDoc.docs[0].data();
                userDocs = await updateCourseWork(courseWorkId, assignedStudentIds, courseWorkData);
                console.log(`CourseWork with given contentId: ${contentId} and courseId: ${courseId} already present`);
            }
        }));
        await batch.commit();
        return userDocs;
    } catch (e) {
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}

async function updateUserDocs(userIds: string[], courseWork: any) {
    return await Promise.all(userIds.map(async (userId) =>
        await updateUser(userId, {
            lastAssignedCourseWork: {
                id: courseWork.id,
                title: courseWork.title,
                contentId: courseWork.contentId
            }
        })
    ));
}

