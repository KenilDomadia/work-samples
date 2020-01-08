import * as responseError from './common/responseError';
import { app } from './app';

export default async function addParentAlias(parentId: string, contactNumber: string): Promise<any> {
    try {
        const userRef = app.firestore.collection('users');
        const userDoc = await userRef.doc(parentId).get();
        if (userDoc.exists) {
            const userData = await userDoc.data();
            if (userData.secondaryNumber) {
                return {
                    status: false,
                    message: `Alias already present for given parentId`
                };
            } else {
                const updateObj = {
                    secondaryNumber: contactNumber,
                    secondaryPassword: '123456'
                };
                await userRef.doc(parentId).set(updateObj, { merge: true });
                return {
                    status: true,
                    data: {
                        contactNumber,
                        password: '123456'
                    }
                };
            }
        } else {
            return {
                status: false,
                message: `Invalid parent id provided`
            };
        }
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
