import * as responseError from './common/responseError';
import { app } from './app';

export default async function signOut(): Promise<any> {
    try {
        await app.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        return {
            status: true
        }
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
