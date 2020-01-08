import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces } from './identifiers';



export default async function updateParentState(updateParentStateObj: DocumentInterfaces.IParentStateDoc): Promise<DocumentInterfaces.IParentStateDoc> {
  try {
    const { id, ...updatedObj } = updateParentStateObj;
    let parentStateRef = app.firestore.collection('parentStates') as firebase.firestore.CollectionReference;
    await parentStateRef.doc(id).set(updatedObj);  
    return updateParentStateObj;
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}