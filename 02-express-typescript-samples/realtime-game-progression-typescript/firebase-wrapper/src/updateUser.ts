import * as responseError from './common/responseError';
import { app } from './app';
import { DocumentInterfaces, Types } from './identifiers';
import filterUndefinedKeys from './common/filterUndefinedKeys';
import filterNullKeys from './common/filterNullKeys';
import getUsers from './getUsers';
import addCredentials from './addCredentials';

export interface IUpdateUserQuery {
    providerIds?: DocumentInterfaces.IProviderIds;
    name?: string;
    schoolId?: string;
    courseId?: string;
    password?: string;
    googleAuthRefreshToken?: string;
    lastAssignedCourseWork?: any;
    imageUrl?: string;
    contactNumber?: string;
    grade?: string;
    age?: number;
    parentId?: string;
    childId?: string;
    children?: string[]
}

export default async function updateUser(userId: string, updateUserInfoObj: IUpdateUserQuery, updateLocalStorage?: boolean): Promise<any> {
    try {
        const usersRef = app.firestore.collection('users').doc(userId);
        const userDocResponse = await getUsers({
            userId
        });
        const userDoc = userDocResponse[0];
        if (!userDoc) {
            throw new Error('User with given id does not exist in the database');
        } else {
            const {
                providerIds,
                name,
                password,
                courseId,
                schoolId,
                googleAuthRefreshToken,
                lastAssignedCourseWork,
                imageUrl,
                contactNumber,
                grade,
                age,
                parentId,
                childId,
                children
            } = updateUserInfoObj;
            const sourceObj = {
                providerIds,
                name,
                password,
                schoolId,
                courseId,
                googleAuthRefreshToken,
                lastAssignedCourseWork,
                imageUrl,
                grade,
                age,
                parentId
            };

            // filter undefined values
            const filteredUpdateUserInfoObj = filterUndefinedKeys(sourceObj);

            // Check if the Number to be updated is Primary or Secondary.
            if (contactNumber) {
                // Checking If the field is passed or not.
                const isPrimaryNumberExists = userDoc.primaryNumber ? true : false;
                if (isPrimaryNumberExists) {
                    // Same Number should not be added to Secondary Number Array
                    if (userDoc.primaryNumber !== contactNumber) {
                        filteredUpdateUserInfoObj.secondaryNumber = app.firestoreFieldValue.arrayUnion(contactNumber);
                    }
                } else {
                    filteredUpdateUserInfoObj.primaryNumber = contactNumber;
                }
            }

            if (childId) {
                // Checking If the field is passed or not.
                filteredUpdateUserInfoObj.children = app.firestoreFieldValue.arrayUnion(childId);
            }

            if (children) {
                filteredUpdateUserInfoObj.children = app.firestoreFieldValue.arrayUnion(...children);
            }

            const isFilteredObjExists = Object.keys(filteredUpdateUserInfoObj).length;
            if (isFilteredObjExists) {
                await usersRef.set(filteredUpdateUserInfoObj, {
                    merge: true
                });
            }

            // check for password
            if (password) {
                if (password.length < 6) {
                    throw new Error('Password should be at least 6 characters');
                }
                // call endpoint updateUserPassword
                const body = {
                    userId,
                    password
                };
                const url = `${Types.BACKEND_URL}/updateUserPassword`;
                try {
                    const urlResponse = await fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(body),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const response = await urlResponse.json();
                    console.log(response);
                } catch (e) {
                    console.log('error updating password: ', e.message);
                }
            }

            const userDocResponse = await getUsers({
                userId
            });
            const updatedUserDoc = userDocResponse[0];

            if (updateLocalStorage) {
                const currentLocalStorage = localStorage.getItem('credentials');
                const credentials = {
                    name: updatedUserDoc.name,
                    uid: updatedUserDoc.id,
                    role: updatedUserDoc.role,
                    email: updatedUserDoc.email,
                    providerId: (currentLocalStorage as any).providerId,
                    schoolId: updatedUserDoc.schoolId,
                    contactNumber: updatedUserDoc.primaryNumber
                };
                localStorage.removeItem('credentials');
                await addCredentials({ credentials, remember: true });
            }

            return updatedUserDoc;
        }
    } catch (e) {
        console.log('Error updating user: ', e.message);
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            'Error while updating user',
            e.message
        );
    }
}
