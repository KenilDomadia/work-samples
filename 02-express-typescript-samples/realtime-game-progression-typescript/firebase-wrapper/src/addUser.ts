import * as responseError from './common/responseError';
import { app } from './app';
import getUsers from './getUsers';
import updateUser from './updateUser';
import { DocumentInterfaces } from './identifiers';

// Define Omit.  Can be defined in a utilities package
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export default async function addUser(userObj: Partial<Omit<DocumentInterfaces.IUsersDoc, 'id'>>): Promise<any> {
    try {
        const userRef = app.firestore.collection('users');
        const usersDoc = await getUsers({ email: userObj.email });
        const insertObj = {
            name: userObj.name || null,
            email: userObj.email || null,
            providerIds: userObj.providerIds,
            role: userObj.role,
            password: userObj.password || null,
            googleAuthRefreshToken: userObj.googleAuthRefreshToken || null,
            districtId: userObj.districtId || null,
            schoolId: userObj.schoolId || null,
            courseId: userObj.courseId || null,
            schools: app.firestoreFieldValue.arrayUnion(userObj.schoolId || null),
            sisId: userObj.sisId || null,
            parentId: userObj.parentId || null,
            primaryNumber: userObj.primaryNumber || null,
            lastAssignedCourseWork: userObj.lastAssignedCourseWork || null,
            imageUrl: userObj.imageUrl || null,
            children: userObj.children || []
        };
        if (!usersDoc.length) {
            const response = await userRef.add(insertObj);
            return { id: response.id, ...userObj };
        } else {
            console.log('User with given email id already exists in users collections. Email:', userObj.email);
            return await updateUser(usersDoc[0].id, {
                name: userObj.name,
                providerIds: userObj.providerIds,
                googleAuthRefreshToken: userObj.googleAuthRefreshToken
            });
        }
    } catch (e) {
        console.log('Error adding user: ', e.message);
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument,
            'Error while adding user',
            e.message);
    }
}
