import * as responseError from './common/responseError';
import { app, Types } from './app';
import loginWithEmail from './loginWithEmail';

export default async function loginWithUsername(username: string, password: string): Promise<any> {
    try {
        const userDoc = await app.firestore.collection('users')
            .where('username', '==', username.toLowerCase())
            .where('password', '==', password)
            .get();
        if (!userDoc.empty) {
            const userData = await userDoc.docs[0].data();
            const email = userData.email;
            await loginWithEmail({ email, password, role: Types.UserPermissionRoles.STUDENT });
            return {
                status: true,
                data: { id: userDoc.docs[0].id, ...userData }
            };
        } else {
            return {
                status: false,
                message: 'Invalid username & password',
                data: {}
            };
        }
    } catch (e) {
        console.log('Error', e);
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
