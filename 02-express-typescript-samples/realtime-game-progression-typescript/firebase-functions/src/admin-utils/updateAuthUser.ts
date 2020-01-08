import * as utils from '../../../utils/src';
import { admin } from './';
import filterUndefinedKeys from '../../../utils/src/common/filterUndefinedKeys';
import { responseError } from '../common';

export interface IUpdateAuthUserOptions {
    displayName?: string;
    email?: string;
    password?: string;
}

export default async function updateAuthUser(userId: string, properties: IUpdateAuthUserOptions): Promise<{}> {
    try {
        console.log(`Getting user info from users collection`);
        const userInfo = await utils.getUsers({ userId });
        console.log(`Fetched user info : ${JSON.stringify(userInfo)}`);

        if (userInfo.length) {
            console.log(`Updating user in firebase authentication database. userId : ${userId}, properties: ${properties}`);
            const userRecord = await admin.auth.updateUser(userInfo[0].providerIds.email, properties);

            // construct updateObj
            const { displayName } = userRecord;
            const { password } = properties;
            const updateObj = filterUndefinedKeys({
                name: displayName,
                password
            });

            console.log(`Updating user in users collection. userId: ${userId} updateObj: ${JSON.stringify(updateObj)}`)
            await utils.updateUser(userId, updateObj);
            return { message: 'user updated successfully.' };
        } else {
            const message = `User with provided userId ${userId} not found. `;
            console.log(message);
            return { message };
        }
    } catch (e) {
        console.log('error occured while updating user in firebase authentication', e);
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument,
            e.message,
            'Error while updating user in firebase authentication');
    }
}