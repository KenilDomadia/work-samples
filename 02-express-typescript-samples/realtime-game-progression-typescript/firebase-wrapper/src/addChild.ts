import * as responseError from './common/responseError';
import { app, Types } from './app';
import generateUsername from './generateUsername';
import RandomString from 'random-string';
import updateUser from './updateUser';

export interface IChildParams {
    name: string;
    grade: string;
    age: number;
    parentId: string;
}

export default async function addChild(
    childObj: IChildParams
): Promise<any> {
    try {
        const [firstName, lastName = ''] = childObj.name.trim().split(' ');

        const userDataInFirestore = await generateUsername({
            firstName,
            lastName,
            role: Types.UserPermissionRoles.STUDENT
        });
        const { email } = userDataInFirestore;
        const password = RandomString({
            length: 6,
            numeric: false,
            letters: true,
            special: false
        }).toLowerCase();

        // Creating user in firebase auth
        const userAuth = await app.auth.createUserWithEmailAndPassword(
            email,
            password
        );

        // update lastAssignedCourseWork based on child's grade
        const grade = parseInt(childObj.grade.split('_')[1]);
        const lastAssignedCourseWork = (grade > 2) ? Types.AssignmentTypes.ALL_OPERATIONS : Types.AssignmentTypes.ADD_SUB;

        const updatedDoc = {
            parentId: childObj.parentId,
            grade: childObj.grade,
            age: childObj.age,
            providerIds: {
                email: userAuth.user.uid,
                google: null,
                clever: null,
                phone: null
            },
            password,
            lastAssignedCourseWork
        };

        const promises = [];

        promises.push(updateUser(userDataInFirestore.id, updatedDoc));

        // Updating parentDoc with childrenId
        promises.push(updateUser(childObj.parentId, {
            childId: userDataInFirestore.id
        }));
        await Promise.all(promises);

        return {
            status: true,
            data: { ...updatedDoc, ...userDataInFirestore }
        };
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
