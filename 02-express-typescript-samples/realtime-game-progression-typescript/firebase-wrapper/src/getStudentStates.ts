import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces } from './identifiers';
import addStudentStateDoc from './addStudentState';

export default async function getStudentState({
  studentId,
  courseId
}): Promise<DocumentInterfaces.IStudentStateDoc[]> {
  try {
    let studentStatesRef = await app.firestore.collection('studentStates') as firebase.firestore.Query;
    if (studentId) {
      studentStatesRef = studentStatesRef.where('studentId', '==', studentId);
      const studentStateDocs = await studentStatesRef.get();
      if (studentStateDocs.empty) {
        // create student state, if not exist
        const studentState = await addStudentStateDoc({ studentId, courseId });
        return [studentState];
      } else {
        const results = studentStateDocs.docs.map(studentStateDoc => {
          return { id: studentStateDoc.id, ...studentStateDoc.data() } as DocumentInterfaces.IStudentStateDoc;
        });
        return results;
      }
    } else {
      return [];
    }
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
