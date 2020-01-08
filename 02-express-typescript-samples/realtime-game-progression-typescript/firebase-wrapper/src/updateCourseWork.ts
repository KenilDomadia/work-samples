import { app } from './app';
import * as responseError from './common/responseError';
import updateUser from './updateUser';

export default async function updateCourseWork(courseWorkId: string, studentIds: string[], courseWorkDoc: any): Promise<any> {
  try {
    const courseWorksRef = app.firestore.collection('courseWorks').doc(courseWorkId);
    await courseWorksRef.set(
      { assignedStudentIds: app.firestoreFieldValue.arrayUnion(...studentIds) },
      { merge: true }
    );
    const courseWork = {
      id: courseWorkId,
      contentId: courseWorkDoc.contentId,
      title: courseWorkDoc.title
    };
    const userDocs = await updateUserDocs(studentIds, courseWork);
    return userDocs;
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
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
