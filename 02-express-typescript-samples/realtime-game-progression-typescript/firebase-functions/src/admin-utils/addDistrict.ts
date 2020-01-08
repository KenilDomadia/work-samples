import { responseError, filterUndefinedKeys } from '../common';
import { admin, DocumentInterfaces, updateDistrict } from './';

export default async function addDistrict(districtObj: DocumentInterfaces.IDistrict): Promise<{ id: string, message?: string }> {
    try {
        const doc = await admin.firestore.collection('district')
            .doc(districtObj.id)
            .get();
        if (doc.exists) {
            console.log('Inside Update');
            const updateObj = {
                name: districtObj.name,
                email: districtObj.email,
                sisType: districtObj.sisType
            };
            await updateDistrict(districtObj.id, updateObj);
            return {
                id: districtObj.id,
                message: `District with given id '${districtObj.id}' already exists. Updated the already existing district with provided values.`
            }
        } else {
            let insertObj = {
                name: districtObj.name,
                email: districtObj.email,
                sisType: districtObj.sisType
            };
            insertObj = filterUndefinedKeys(insertObj);
            await admin.firestore.collection('districts').doc(districtObj.id).set(insertObj);
            return { id: districtObj.id };
        }
    } catch (e) {
        console.log(e);
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
