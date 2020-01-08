import * as responseError from './common/responseError';
import {Types} from './identifiers/Types';

export default async function removeChild(childId: string): Promise<boolean> {
    try {
        const url = `${Types.BACKEND_URL}/removeChild`;
        const urlResponse = await fetch(url, {
            body: JSON.stringify({
              childId
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const responseJSON = await urlResponse.json();
        return responseJSON;
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
