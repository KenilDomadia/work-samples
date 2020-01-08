import { responseError } from '../common';
import { admin, DocumentInterfaces } from './';
import * as firebase from 'firebase-admin';
export interface IDistrictQueryParams {
    districtId?: string;
    email?: string;
}

export default async function getDistrict({ districtId, email }: Partial<IDistrictQueryParams>): Promise<DocumentInterfaces.IDistrict[]> {
    const districtRef = admin.firestore.collection('district');
    if (districtId) {
        try {
            const districtDoc = await getDistrictDocUsingId(districtRef, districtId);
            if (districtDoc) {
                return [districtDoc];
            } else {
                return [];
            }
        } catch (e) {
            throw new responseError.HttpsError(
                responseError.FunctionsErrorCode.invalid_argument,
                'Error fetching district info from district id ' + districtId,
                e.message
            );
        }
    } else if (email) {
        try {
            return await getDistrictDocUsingEmail(districtRef, email);
        } catch (e) {
            throw new responseError.HttpsError(
                responseError.FunctionsErrorCode.invalid_argument,
                'Error fetching district info from district id ' + districtId,
                e.message
            );
        }
    } else {
        return [];
    }
}

async function getDistrictDocUsingId(
    districtRef: firebase.firestore.CollectionReference,
    districtId: string
): Promise<any> {
    const districtDoc = await districtRef.doc(districtId).get();
    return { ...districtDoc.data(), id: districtId };
}

async function getDistrictDocUsingEmail(
    districtRef: firebase.firestore.CollectionReference,
    email: string
): Promise<any> {
    await districtRef.where('email', '==', email).get();
}
