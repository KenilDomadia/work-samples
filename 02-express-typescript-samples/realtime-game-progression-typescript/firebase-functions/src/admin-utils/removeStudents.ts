import { responseError } from '../common';
import * as utils from '../../../utils/src';
import { admin } from './index';

export default async function removeStudents(courseId: string, studentsIds: string[]): Promise<boolean> {
    try {
        const studentCount = -Math.abs(studentsIds.length);
        const courseWorkObj = {
            assignedStudentIds: utils.app.firestoreFieldValue.arrayRemove(...studentsIds)
        };
        const courseObj = {
            students: utils.app.firestoreFieldValue.arrayRemove(...studentsIds),
            noOfStudents: utils.app.firestoreFieldValue.increment(studentCount)
        };
        const courseWorkDoc = await admin.firestore.collection('courseWorks').where('courseId', '==', courseId).get();

        for(const i in courseWorkDoc.docs) {
            const doc = courseWorkDoc.docs[i];
            await admin.firestore.collection('courseWorks').doc(doc.id).set(courseWorkObj, { merge: true });
        }

        // decrement students count in course doc
        await admin.firestore.collection('courses').doc(courseId).set(courseObj, { merge: true });

        const promises = [];
        for(const i in studentsIds) {
            const userId = studentsIds[i];
            const [userData] = await utils.getUsers({ userId });
            if (userData.parentId === null) {
                const uid = userData.providerIds.email ? userData.providerIds.email : ( userData.providerIds.google ? userData.providerIds.google : userData.providerIds.clever );
                promises.push(admin.firestore.collection('users').doc(userId).delete());
                promises.push(admin.auth.deleteUser(uid));
            } else {
                promises.push(utils.updateUser(userId, { courseId: null }));
            }
        }
        await Promise.all(promises);
        return true;
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
