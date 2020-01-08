import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces, Types } from './identifiers';
import getCourses from './getCourses';
export interface IUsersQueryParams {
    courseId?: string;
    role?: Types.UserPermissionRoles;
    userId?: string;
    email?: string;
    uid?: string;
    schoolId?: string;
    courseWorkId?: string;
    parentId?: string;
    childId?: string;
    phoneNumber?: string;
    teacherId?: string;
}

export default async function getUsers({
    courseId,
    role = Types.UserPermissionRoles.STUDENT,
    userId,
    email,
    uid,
    schoolId,
    courseWorkId,
    parentId,
    childId,
    phoneNumber,
    teacherId
}: Partial<IUsersQueryParams>): Promise<DocumentInterfaces.IUsersDoc[]> {
    const usersRef = app.firestore.collection('users');
    if (userId) {
        try {
            const userDoc = await getUserDocUsingUserId(usersRef, userId);
            if (userDoc.exists) {
                return [userDoc];
            } else {
                return [];
            }
        } catch (e) {
            throw new responseError.HttpsError(
                responseError.FunctionsErrorCode.invalid_argument,
                'Error fetching student info from student id ' + userId,
                e.message
            );
        }
    } else if (uid && schoolId) {
        const userDoc = await getUserDocUsingUserIdAndSchoolId(usersRef, uid, schoolId);
        if (userDoc.exists) {
            return [userDoc];
        } else {
            return [];
        }
    } else if (courseId) {
        return await getUserDocUsingCourseId(usersRef, courseId, role, {
            email
        });
    } else if (courseWorkId) {
        const courseWorksDoc = await app.firestore.collection(`courseWorks`).doc(courseWorkId).get();
        if (courseWorksDoc.exists) {
            if (courseWorksDoc.data().assigneeMode === Types.AssigneeModes.INDIVIDUAL_STUDENTS) {
                const promise = [];
                const studentIdValues = courseWorksDoc.data().assignedStudentIds;
                for (const studentIdValue of studentIdValues) {
                    const userDoc = await getUserDocUsingUserId(usersRef, studentIdValue);
                    if ((userDoc as any).lastAssignedCourseWork.id === courseWorkId) {
                        promise.push(userDoc);
                    }
                }
                const userDocs = await Promise.all(promise);
                return userDocs;
            } else {
                return await getUserDocUsingCourseId(usersRef, courseWorksDoc.data().courseId, role, {
                    email
                });
            }
        } else {
            return [];
        }
    } else if (email) {
        try {
            return await getUserDocUsingEmail(usersRef, email);
        } catch (e) {
            throw new responseError.HttpsError(
                responseError.FunctionsErrorCode.invalid_argument,
                'Error fetching student info from email ' + email,
                e.message
            );
        }
    } else if (parentId) {
        try {
            const userDoc = await getUserDocUsingParentId(usersRef, parentId);
            if (userDoc.exists) {
                return [userDoc];
            } else {
                return [];
            }
        } catch (e) {
            throw new responseError.HttpsError(
                responseError.FunctionsErrorCode.invalid_argument,
                'Error fetching parent info from parent id ' + parentId,
                e.message
            );
        }
    } else if (childId) {
        try {
            const userDoc = await getUserDocUsingChildId(usersRef, childId);
            if (userDoc.length) {
                return [userDoc];
            } else {
                return [];
            }
        } catch (e) {
            throw new responseError.HttpsError(
                responseError.FunctionsErrorCode.invalid_argument,
                'Error fetching child info from child id ' + childId,
                e.message
            );
        }
    } else if (phoneNumber) {
        try {
            const userDoc = await getUserDocUsingPhoneNumber(usersRef, phoneNumber);
            if (userDoc.exists) {
                return [userDoc];
            } else {
                return [];
            }
        } catch (e) {
            throw new responseError.HttpsError(
                responseError.FunctionsErrorCode.invalid_argument,
                'Error fetching user info from phoneNumber ' + phoneNumber,
                e.message
            );
        }
    } else if (teacherId) {
        try {
            const userDoc = await getUserDocUsingTeacherId(usersRef, teacherId);
            if (userDoc.exists) {
                return [userDoc];
            } else {
                return [];
            }
        } catch (e) {
            throw new responseError.HttpsError(
                responseError.FunctionsErrorCode.invalid_argument,
                'Error fetching user info from teacherId ' + teacherId,
                e.message
            );
        }
    } else {
        return [];
    }
}
async function getUserDocUsingEmail(
    usersRef: firebase.firestore.CollectionReference,
    email: string
) {
    const usersDoc = await usersRef.where('email', '==', email).get();
    if (usersDoc.size > 1) {
        console.log(`Multiple users with email ${email} found.`);
    }

    if (usersDoc.empty) {
        console.log(`No users with email ${email} found.`);
        return [];
    }

    const userDoc = usersDoc.docs[0];
    const userInfo: any = { id: userDoc.id, ...userDoc.data() };
    return [userInfo];
}

async function getUserDocUsingUserId(
    usersRef: firebase.firestore.CollectionReference,
    userId: string
): Promise<any> {
    const userDoc = await usersRef.doc(userId).get();
    return { ...userDoc.data(), id: userDoc.id, exists: userDoc.exists };
}

async function getUserDocUsingUserIdAndSchoolId(
    usersRef: firebase.firestore.CollectionReference,
    userId: string,
    schoolId: string
): Promise<any> {
    const userDoc = await usersRef.doc(userId).get();
    if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData.schoolId === schoolId) {
            return { ...userData, id: userDoc.id, exists: userDoc.exists };
        } else {
            return { exists: !userDoc.exists };
        }
    } else {
        return { exists: userDoc.exists };
    }
}

async function getUserDocUsingParentId(
    usersRef: firebase.firestore.CollectionReference,
    parentId: string
): Promise<any> {
    const userDoc = await usersRef.doc(parentId).get();
    if (userDoc.exists) {
        let { children } = userDoc.data();
        let promises = children.map(childId => getUsers({ userId: childId }))
        const resolvedPromises = await Promise.all(promises);
        children = resolvedPromises.map(child => {
            return child[0];
        });
        return { id: userDoc.id, ...userDoc.data(), children, exists: userDoc.exists };
    } else {
        return { exists: userDoc.exists }
    }
}

async function getUserDocUsingTeacherId(
    usersRef: firebase.firestore.CollectionReference,
    teacherId: string
): Promise<any> {
    try {
        const userDoc = await usersRef.doc(teacherId).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            if (userData.role !== Types.UserPermissionRoles.TEACHER) {
                throw new responseError.HttpsError(
                    responseError.FunctionsErrorCode.permission_denied,
                    'Teacher doc is not associated with role as Teacher ' + teacherId,
                );
            }

            const courses = await getCourses({ teacherId });
            const students = [];
            const promise = [];
            courses.map(course => {
                course.students.map(studentId => {
                    promise.push(getUsers({ userId: studentId }));
                });
            });
            const resolvedPromises = await Promise.all(promise);
            resolvedPromises.map(student => {
                students.push(student[0]);
            });
            return { id: userDoc.id, ...userData, courses, children: students, exists: userDoc.exists };
        } else {
            return { exists: userDoc.exists };
        }
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}

async function getUserDocUsingChildId(
    usersRef: firebase.firestore.CollectionReference,
    childId: string
): Promise<any> {
    const userDocs = await usersRef.where('children', 'array-contains', childId).get();
    const users = userDocs.docs.map(user => {
        return { id: user.id, ...user.data() }
    });
    return users;
}
async function getUserDocUsingPhoneNumber(
    usersRef: firebase.firestore.CollectionReference,
    phoneNumber: string
): Promise<any> {
    let userDocsPromises = [usersRef.where('primaryNumber', '==', phoneNumber).get(),
    usersRef.where('secondaryNumber', 'array-contains', phoneNumber).get()];
    let resolvedUserDocsPromises = await Promise.all(userDocsPromises);
    let [userDoc] = resolvedUserDocsPromises.map(userDocs => {
        let [userDoc] = userDocs.docs.map(userDoc => {
            return {
                id: userDoc.id,
                ...userDoc.data(),
                exists: userDoc.exists
            }
        });
        return userDoc
    }).filter(doc => doc !== undefined);
    if(userDoc){
        return userDoc
    }else{
        return {
            exists :false
        }
    }
}
interface IGetUserDocUsingCourseIdFilters {
    email?: string;
}
async function getUserDocUsingCourseId(
    usersRef: firebase.firestore.CollectionReference,
    courseId: string,
    role: Types.UserPermissionRoles,
    filters: IGetUserDocUsingCourseIdFilters
): Promise<DocumentInterfaces.IUsersDoc[]> {
    try {
        const courseInfo = await getCourses({ courseId });
        if (courseInfo.length) {
            const studentsIds = courseInfo[0].students;
            let userDocs = [];
            for (const studentId of studentsIds) {
                const doc = await usersRef.doc(studentId).get();
                userDocs.push(doc.data());
            }
            return userDocs;
        } else {
            const msg = `No courses for given studentId ${courseId} found..`;
            console.log(msg);
            return [];
        }
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
