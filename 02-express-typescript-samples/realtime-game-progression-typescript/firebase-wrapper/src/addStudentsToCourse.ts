import * as responseError from './common/responseError';
import { Types } from './app';
import generateUsername from './generateUsername';
import getUsers from './getUsers';
import fetch from 'cross-fetch';
import addStudentViaCSVMapping from './addStudentsViaCSVMapping';
import getCourses from './getCourses';

export interface IAddStudentQueryParams {
    courseId: string;
    schoolId: string;
    students: Partial<IStudentsParams>[];
    providerType: Types.UserAuthProviders;
}

export interface IStudentsParams {
    firstName: string;
    lastName: string;
    password: string;
    email?: string;
    contactNumber?: string;
    age?: number
}

export default async function addStudentsToCourse(requestData: IAddStudentQueryParams): Promise<any> {
    try {
        const courseInfo = await getCourses({ courseId: requestData.courseId });
        const { grade } = courseInfo[0];
        let newStudents = [], existingStudents = [], linkParentWithStudentViaContactNumber = [];
        for (let i = 0; i < requestData.students.length; i++) {
            const { firstName, lastName, password, email, contactNumber, age } = requestData.students[i];
            let userData;
            if (email) {
                const userDoc = await getUsers({ email });
                if (userDoc.length) {
                    if (userDoc[0].role === Types.UserPermissionRoles.STUDENT) {
                        userData = userDoc[0];
                        existingStudents.push({
                            ...userData,
                        });
                    }
                } else {
                    userData = await generateUsername({ firstName, lastName, role: Types.UserPermissionRoles.STUDENT, email, grade, age });
                    newStudents.push({
                        ...userData,
                        password
                    });
                }
            } else {
                userData = await generateUsername({ firstName, lastName, role: Types.UserPermissionRoles.STUDENT, grade, age });
                newStudents.push({
                    ...userData,
                    password
                });
                if (contactNumber) {
                    linkParentWithStudentViaContactNumber.push({ ...userData, contactNumber });
                }
            }
        }
        if (linkParentWithStudentViaContactNumber.length > 0) {
            await addStudentViaCSVMapping(linkParentWithStudentViaContactNumber);
        }
        const url = `${Types.BACKEND_URL}/addStudentsToCourse`;
        const urlResponse = await fetch(url, {
            body: JSON.stringify({
                courseId: requestData.courseId,
                schoolId: requestData.schoolId,
                providersType: requestData.providerType,
                newStudents,
                existingStudents
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
