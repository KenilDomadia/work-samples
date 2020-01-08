import * as utils from '../../../utils/src';
import { admin } from './';
import { responseError } from '../common';

export interface StudentInfo {
    email: string;
    password: string;
    name: string;
    provider: utils.Types.UserAuthProviders;
}

/**
 * Creates auth user and add it to users collection
 * !!!!DEPRECATED!!!
 */
export default async function createUser(student: StudentInfo, schoolId: string): Promise<any> {
    const insertObj = {
        displayName: student.name,
        email: student.email,
        password: student.password,
        emailVerified: true
    };
    try {
        let userInfo;
        try {
            userInfo = await admin.auth.getUserByEmail(student.email);
            console.log(`Email : ${student.email} already exists in firebase authentication. Updating name, permissions and password in users collection`);
        } catch (e) {
            console.log('creating auth user...', e.code);
            if (e.code === responseError.FunctionsErrorCode.user_not_found) {
                userInfo = await createAuthUserWithPassword(insertObj);
            } else {
                console.log('unknown error occured while creating auth user... ', e);
            }
        }

        // console.log('adding to users collection...');
        // const addUserResponse = await utils.addUser({
        //     name: insertObj.displayName,
        //     email: insertObj.email,
        //     providerIds: {
        //         [student.provider || utils.Types.UserAuthProviders.EMAIL]: userInfo.uid
        //     },
        //     schoolId,
        //     password: insertObj.password
        // });
        return 'This function doesn't work right now';
    }
    catch (e) {
        console.log('Error creating user: ', e.message);
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument,
            'Error while creating user',
            e.message);

    }
}


async function createAuthUserWithPassword(insertObj) {
    const newUser = await admin.auth.createUser(insertObj);
    return { ...newUser, password: insertObj.password };
}