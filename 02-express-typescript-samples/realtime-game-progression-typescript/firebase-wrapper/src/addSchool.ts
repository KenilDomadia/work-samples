import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces } from './identifiers/DocumentInterfaces';
import getSchools from './getSchools';
import updateUser from './updateUser';
import filterNullKeys from './common/filterNullKeys';
import filterUndefinedKeys from './common/filterUndefinedKeys';
export interface ISchoolParams {
    name: string;
    districtId?: string;
    sisNumber?: string;
    schoolNumber?: string;
    lowGrade?: string;
    highGrade?: string;
    ncesId?: string;
    mdrNumber?: string;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export default async function addSchool(userId: string, schoolObj: ISchoolParams): Promise<DocumentInterfaces.ISchool> {
    try {
        const { name, districtId, sisNumber, schoolNumber, lowGrade, highGrade, ncesId, mdrNumber } = schoolObj;
        const schoolRef = app.firestore.collection('schools');
        const schoolDocs = await getSchools({ name });
        const insertObj: Omit<DocumentInterfaces.ISchool, 'id'> = {
            name,
            districtId,
            sisNumber,
            schoolNumber,
            lowGrade,
            highGrade,
            ncesId,
            mdrNumber,
        };
        if (!schoolDocs.length) {
            const filteredObj = filterNullKeys(filterUndefinedKeys(insertObj));
            const response = await schoolRef.add(filteredObj);
            await updateUser(userId, { schoolId: response.id });
            return { id: response.id, ...filteredObj };
        } else {
            await updateUser(userId, { schoolId: schoolDocs[0].id });
            return schoolDocs[0];
        }
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,

        )
    }
}
