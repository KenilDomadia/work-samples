import { responseError } from '../common';
import * as utils from '../../../utils/src';

export default async function removeChild(childId: string): Promise<boolean> {
    try {
      const childDoc = await utils.app.firestore.collection('users').doc(childId).get();
      if (childDoc.exists) {
        const childData = await childDoc.data();
        const parentId = childData.parentId;
        const parentUpdateObj = {
          children: utils.app.firestoreFieldValue.arrayRemove(childId)
        };
        const childState = await utils.app.firestore.collection('studentStates').where('studentId', '==', childId).get();
        const promises = [];
        
        if (childData.courseId === null) {
          childState.forEach(stateDoc => {
            promises.push(utils.app.firestore.collection('studentStates').doc(stateDoc.id).delete());
          });
          promises.push(utils.app.firestore.collection('users').doc(childId).delete());
        }
        promises.push(utils.app.firestore.collection('users').doc(parentId).set(parentUpdateObj, { merge: true }));
        await Promise.all(promises);
        return true;
      } else {
        throw new Error('Child not found!');
      }
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
