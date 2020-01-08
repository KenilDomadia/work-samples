import * as responseError from './common/responseError';
import { DocumentInterfaces, Types } from './identifiers';
import { app } from './app';
import addCredentials from './addCredentials';
import addUser from './addUser';
import getUsers from './getUsers';

export default async function signUpWithEmail(
  context: DocumentInterfaces.IAuth
): Promise<any> {
  try {
    const { uname, email, password, role, userId } = context;
    const userExists = await getUsers({ email });
    if (userExists.length > 0) {
      return {
        status: false,
        alreadyExists: true,
        message: `User with given email ${email} already present`
      };
    }
    const username = email.split('@');
    if (userId) {
      const authData = await app.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const { uid } = authData.user;
      const body = {
        userId,
        email,
        name: uname || '',
        password,
        username: username[0],
        uid
      };
      const url = `${Types.BACKEND_URL}/updateUserEmail`;
      try {
        const urlResponse = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const response = await urlResponse.json();
        if (response.data.status && !response.data.alreadyExists) {
          const [updatedUserDoc] = await getUsers({ email });
          const credentials = {
            name: updatedUserDoc.name,
            uid: updatedUserDoc.id,
            role: updatedUserDoc.role,
            email: updatedUserDoc.email,
            providerId: 'password',
            schoolId: updatedUserDoc.schoolId,
            contactNumber: updatedUserDoc.primaryNumber
          };
          await addCredentials({ credentials, remember: true });
          return {
            status: true,
            alreadyExists: false,
            data: {
              ...updatedUserDoc
            }
          };
        } else {
          return {
            status: false,
            alreadyExists: true,
            message: 'Email already exists!'
          };
        }
      } catch (e) {
        console.log('error updating email: ', e.message);
      }
    } else {
      const data = await app.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const { displayName, uid } = data.user;
      const userObj = {
        name: uname || displayName,
        username: username[0],
        email,
        password,
        role,
        providerIds: {
          email: uid,
          google: null,
          clever: null,
          phone: null,
          facebook: null
        }
      };
      const response = await addUser(userObj);
      const credentials = {
        name: response.name,
        uid: response.id,
        role: response.role,
        email: response.email,
        providerId: 'password',
        schoolId: response.schoolId,
        contactNumber: response.primaryNumber
      };
      await addCredentials({ credentials, remember: true });
      return {
        status: true,
        alreadyExists: false,
        data: {
          ...response
        }
      };
    }
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
