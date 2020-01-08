import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces } from './identifiers';
import filterUndefinedKeys from './common/filterUndefinedKeys';

export default async function updateStudentState(
  studentStateId: string,
  { state }: Partial<DocumentInterfaces.IStudentStateDoc>
): Promise<any> {
  try {
    const sourceObj: any = {
      state
    };
    const updateObj = filterUndefinedKeys(sourceObj);
    const batch = app.firestore.batch();
    const studentSubmissionRef = app.firestore
      .collection('studentStates')
      .doc(studentStateId);
    batch.update(studentSubmissionRef, updateObj);
    await batch.commit();
    console.log('Student state updated successfully.');
    return {
      status: true,
      data: {}
    };
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
