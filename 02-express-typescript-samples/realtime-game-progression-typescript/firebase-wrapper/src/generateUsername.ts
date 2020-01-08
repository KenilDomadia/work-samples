import * as responseError from './common/responseError';
import { app } from './app';
import {Types} from './identifiers';

export interface IUsernameQueryParams {
    firstName: string;
    lastName: string;
    role?: Types.UserPermissionRoles;
    email?: string;
    grade?: string;
    age?: number;
}

export default async function generateUsername({
    firstName,
    lastName,
    role = Types.UserPermissionRoles.STUDENT,
    email,
    grade,
    age
}: Partial<IUsernameQueryParams>): Promise<any> {
    try {
        let username = firstName.toLowerCase().trim() + lastName.trim().substring(0, 1).toLowerCase();
        const userRef = app.firestore.collection('users');
        const userDocs = await userRef.where('username', '>=', username)
            .where('username', '<=', username + '\uf8ff').get();
        if (!userDocs.empty) {
            username = username.replace(' ', '') + userDocs.size;
        }
        const insertObj = {
            name: (firstName + ' ' + lastName).trim(),
            username,
            email: email || (username + '@playpowerlabs.com'),
            role,
            grade: grade || null,
            age: age || null
        };
        const response = await userRef.add(insertObj);
        return { id: response.id, ...insertObj };
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
