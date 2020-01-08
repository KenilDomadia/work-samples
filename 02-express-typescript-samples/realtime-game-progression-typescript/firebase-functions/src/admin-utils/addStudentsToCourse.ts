import * as utils from '../../../utils/src';
import { responseError } from '../common';
import {admin} from './index';
import * as _ from 'lodash';

export interface StudentInfo {
    id: string;
    username: string;
    email: string;
    password: string;
    name: string;
    role: utils.Types.UserPermissionRoles;
}

export default async function addStudentsToCourse(studentsNew: StudentInfo[], studentsExists: any[], courseId: string, schoolId: string, providersType: utils.Types.UserAuthProviders): Promise<any[]> {
    const courses = await utils.getCourses({ courseId });

    if (!courses.length) {
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument,
            `Given  ${courseId}  does not exist.`);
    }
    else {
        try {
            const updatedStudentsList = [];
            let newStudentIds = [];
            let existingStudentIds = [];
            for (const studentObj of studentsNew) {
                const { id, email, password, name } = studentObj;
                let providerIds = {};
                const newUserData = await admin.auth.createUser({
                    email,
                    emailVerified: true,
                    password,
                    displayName: name,
                    disabled: false
                });
                switch (providersType) {
                    case utils.Types.UserAuthProviders.EMAIL:
                        providerIds = {
                            email: newUserData.uid
                        };
                        break;
                    case utils.Types.UserAuthProviders.GOOGLE:
                        providerIds = {
                            google: newUserData.uid
                        };
                        break;
                }
                newStudentIds.push(id);
                const updateObj = {
                    providerIds,
                    password,
                    districtId: null,
                    schoolId,
                    courseId,
                    schools: utils.app.firestoreFieldValue.arrayUnion(schoolId),
                };
                const finalStudentObj = _.merge(studentObj, updateObj);
                updatedStudentsList.push(finalStudentObj);
                await admin.firestore.collection('users').doc(id).set(updateObj, { merge: true });
            }
            for (const studentObj of studentsExists) {
                const { id } = studentObj;
                existingStudentIds.push(id);
                const updateObj = {
                    courseId,
                };
                const updatedStudentObj = _.merge(studentObj, updateObj);
                updatedStudentsList.push(updatedStudentObj);
                await admin.firestore.collection('users').doc(id).set(updateObj, { merge: true });
            }

            newStudentIds = _.difference(newStudentIds, courses[0].students);
            existingStudentIds = _.difference(existingStudentIds, courses[0].students);

            if (newStudentIds.length > 0 || existingStudentIds.length > 0) {
                const courseObj = {
                    students: utils.app.firestoreFieldValue.arrayUnion(...newStudentIds, ...existingStudentIds),
                    noOfStudents: utils.app.firestoreFieldValue.increment(newStudentIds.length + existingStudentIds.length)
                };
                await admin.firestore.collection('courses').doc(courseId).set(courseObj, { merge: true });
            }
            return updatedStudentsList;
        } catch (e) {
            throw new responseError.HttpsError(
                responseError.FunctionsErrorCode.invalid_argument,
                e.message
            );
        }
    }
}
