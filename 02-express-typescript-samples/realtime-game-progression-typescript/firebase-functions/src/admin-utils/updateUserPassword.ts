import * as utils from '../../../utils/src';
import * as adminUtils from '../admin-utils';
import filterUndefinedKeys from '../../../utils/src/common/filterUndefinedKeys';
import { responseError } from '../common';



export default async function updateUserPassword(userId: string, password: string): Promise<{}> {
    try {
        //const {userId, password} = request.body;
        console.log(`Getting user info from users collection`);
        const userInfo = await utils.getUsers({ userId });
        console.log(`Fetched user info : ${JSON.stringify(userInfo)}`);

        if (userInfo.length) {
            console.log(`Updating user in firebase authentication database. userId : ${userId}`);
            await adminUtils.admin.auth.updateUser(userInfo[0].providerIds.email, { password });

            // construct updateObj
            const updateObj = filterUndefinedKeys({
                password
            });

            console.log(`Updating user in users collection. userId: ${userId} updateObj: ${JSON.stringify(updateObj)}`)
            // await utils.updateUser(userId, updateObj);
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