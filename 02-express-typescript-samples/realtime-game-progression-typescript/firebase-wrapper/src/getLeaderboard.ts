import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces } from './identifiers';

interface FieldNames {
  TODAY_SCORE: string;
  LAST_LOGIN_TIME: string;
}
export default async function getLeaderboard({
  courseId
}, fieldNames: FieldNames): Promise<DocumentInterfaces.IStudentStateDoc[]> {
  try {
    let studentStatesRef = await app.firestore.collection('studentStates') as firebase.firestore.Query;

    // get students in the course and get top n entries sorted by score
    studentStatesRef = studentStatesRef.where('courseId', '==', courseId)
      .where(`state.${fieldNames.LAST_LOGIN_TIME}`, '>=', new Date(new Date().toDateString()).getTime())
      .where(`state.${fieldNames.LAST_LOGIN_TIME}`, '<=', Date.now())
      .orderBy(`state.${fieldNames.LAST_LOGIN_TIME}`, 'desc')
      .orderBy(`state.${fieldNames.TODAY_SCORE}`, 'desc');

    const studentStateDocs = await studentStatesRef.get();
    const results = studentStateDocs.docs.map(studentStateDoc => {
      return { id: studentStateDoc.id, ...studentStateDoc.data() } as DocumentInterfaces.IStudentStateDoc;
    });
    return results;
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
