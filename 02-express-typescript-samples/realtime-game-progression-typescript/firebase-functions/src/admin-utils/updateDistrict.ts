import { responseError, filterUndefinedKeys } from '../common';
import { admin } from './';
export interface ICleverDistrictUpdateQuery {
    name?: string;
    email?: string;
    sisType?: string;
}

export default async function updateDistrict(
    districtId: string,
    districtObj: ICleverDistrictUpdateQuery
): Promise<{ id: string, message: string}> {
    try {
        const docRef = admin.firestore.collection('districts').doc(districtId);
        const sourceObj = {
            name: districtObj.name,
            email: districtObj.email,
            sisType: districtObj.sisType
        };
        const updateObj = filterUndefinedKeys(sourceObj);
        await docRef.update(updateObj);
        return { id: districtId, message: 'District has been updated successfully.'};
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.internal,
            e.message
        );
    }
}

