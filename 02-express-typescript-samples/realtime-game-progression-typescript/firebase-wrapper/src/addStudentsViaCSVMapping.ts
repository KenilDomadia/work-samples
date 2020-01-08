import { app, Types } from './app';
import { DocumentInterfaces } from './identifiers';
import getUsers from './getUsers';
import * as responseError from './common/responseError';

interface IAddStudentViaCSVMapping extends DocumentInterfaces.IUsersDoc{
    contactNumber: string;
}

export default async function addStudentViaCSVMapping(requestData: IAddStudentViaCSVMapping[]): Promise<any> {
    try {
        const batch = app.firestore.batch();
        for (const student of requestData) {
            const childDocRef = app.firestore.collection('users').doc(student.id);
            const userDocUsingContactNumber = await getUsers({ phoneNumber: student.contactNumber });
            if (userDocUsingContactNumber.length > 0) {
                const parentDocRef = app.firestore.collection('users').doc(userDocUsingContactNumber[0].id);
                batch.update(parentDocRef, { children: app.firestoreFieldValue.arrayUnion(student.id) })
                batch.update(childDocRef, { parentId: userDocUsingContactNumber[0].id });
            } else {
                const insertObj: Partial<DocumentInterfaces.IUsersDoc> = {
                    name: null,
                    email: null,
                    providerIds: {
                        email: null,
                        google: null,
                        clever: null,
                        phone: null
                    },
                    role: Types.UserPermissionRoles.PARENT,
                    password: null,
                    googleAuthRefreshToken: null,
                    districtId: null,
                    schoolId: null,
                    courseId: null,
                    schools: app.firestoreFieldValue.arrayUnion(null),
                    sisId: null,
                    parentId: null,
                    primaryNumber: student.contactNumber,
                    lastAssignedCourseWork: null,
                    imageUrl: null,
                    children: [student.id]
                };
                const parentDocRef = app.firestore.collection('users').doc();
                batch.set(parentDocRef, insertObj);
                batch.update(childDocRef, { parentId: parentDocRef.id });
            }
        }
        await batch.commit();
        return {
            status: true,
            alreadyExists: false,
            message: 'Students mapping with parents done successfully'
          };
    } catch(e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}