import * as responseError from './common/responseError';
import { Types } from './identifiers/Types';

export default async function removeStudents(courseId: string, studentIds: string[]): Promise<boolean> {
    try {
        const url = `${Types.BACKEND_URL}/removeStudents`;
        const urlResponse = await fetch(url, {
            body: JSON.stringify({
                courseId: courseId,
                studentIds: studentIds
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
