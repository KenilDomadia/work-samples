import * as adminUtils from '../../admin-utils';
import { IncomingRequest } from '../../common/TypesAndIdentifiers';
import { responseError } from '../../common';


export default async (request: IncomingRequest) => {
    const { email } = request.body;
    try {
        const resetLink = await adminUtils.admin.auth.generatePasswordResetLink(email);

        const response = await adminUtils.sendEmail({
            to: email,
            subject: 'Password Reset Link',
            text: 'Click on the link to reset your password ' + `\n ${resetLink}`
        })

        console.log(`Password reset link has been sent to ${email}`);
        return response;

    } catch (e) {
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument,
            e.message);
    }

}