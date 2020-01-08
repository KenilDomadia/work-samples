import * as responseError from './common/responseError';
import { Types } from './identifiers';
import getUsers from './getUsers';
import generateUsername from './generateUsername';
import { app } from './app';
import addCredentials from './addCredentials';
import getCourses from './getCourses';
import addCourseWorks from './addCourseWorks';

export interface IQueryParams {
    parentEmail?: string;
    classCode?: string;
    firstName: string;
    lastName: string;
    password: string;
    grade?: number;
}

export default async function signUpStudent(requestData: IQueryParams): Promise<any> {
    try {
        const { parentEmail, classCode, firstName, lastName, password, grade } = requestData;
        let userObj;
        const userData = await generateUsername({
            firstName,
            lastName,
            role: Types.UserPermissionRoles.STUDENT
        });
        const { email, name } = userData;
        const userAuth = await app.auth.createUserWithEmailAndPassword(email, password);
        const uid = userAuth.user.uid;
        const providerId = userAuth.user.providerId;

        if (parentEmail) {
            const parentDoc = await getUsers({ email: parentEmail });
            if (parentDoc.length) {
                userObj = {
                    providerIds: {
                        email: uid
                    },
                    grade,
                    parentId: parentDoc[0].id,
                    password
                };
                const parentObj = {
                    children: app.firestoreFieldValue.arrayUnion(userData.id)
                };

                await app.firestore.collection('users').doc(userData.id).set(userObj, { merge: true });
                await app.firestore.collection('users').doc(parentDoc[0].id).set(parentObj, { merge: true });
            } else {
                return {
                    status: false,
                    message: `Given parent email doesn't exists in database!`
                };
            }
        } else if (classCode) {
            const courseDoc = await getCourses({ enrollmentCode: classCode.toUpperCase() });
            let { id, schoolId, districtId, teacherId } = courseDoc[0];
            const courseWork = await addCourseWorks([{
                title: 'ALL OPERATIONS (0-10)',
                assigneeMode: Types.AssigneeModes.INDIVIDUAL_STUDENTS,
                contentId: 'ALL_OPERATIONS',
                courseId: id,
                assignorId: teacherId,
                schoolId,
                assignedStudentIds: [userData.id],
                description: '',
            }]);

            userObj = {
                ...courseWork[0],
                providerIds: {
                    email: uid
                },
                districtId,
                schoolId,
                courseId: id,
                password
            };
            const courseObj = {
                students: app.firestoreFieldValue.arrayUnion(userData.id),
                noOfStudents: app.firestoreFieldValue.increment(1)
            };

            await app.firestore.collection('users').doc(userData.id).set(userObj, { merge: true });
            await app.firestore.collection('courses').doc(id).set(courseObj, { merge: true });

        }

        const credentials = {
            name,
            uid: (userData as any).id,
            role: Types.UserPermissionRoles.STUDENT,
            email,
            providerId,
            schoolId: ''
        };

        await addCredentials({ credentials, remember: true });
        return {
            status: true,
            data: { ...userData, ...userObj }
        };

    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
