import * as responseError from './common/responseError';
import getUsers from './getUsers';
import { app } from './app';
import storeToken from './storeToken';
import { Types } from './identifiers';
import addCredentials from './addCredentials';

interface IGoogleAuthQueryParams {
  role: Types.UserPermissionRoles;
  userId?: string;
}

export default async function signUpWithGoogle(
  params: IGoogleAuthQueryParams
): Promise<any> {
  try {
    const { role, userId } = params;
    const provider = new app.authGoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    if (role === Types.UserPermissionRoles.TEACHER) {
      provider.addScope('https://www.googleapis.com/auth/classroom.courses');
      provider.addScope(
        'https://www.googleapis.com/auth/classroom.courses.readonly'
      );
      provider.addScope('https://www.googleapis.com/auth/classroom.rosters');
      provider.addScope(
        'https://www.googleapis.com/auth/classroom.rosters.readonly'
      );
      provider.addScope(
        'https://www.googleapis.com/auth/classroom.profile.emails'
      );
      provider.addScope(
        'https://www.googleapis.com/auth/classroom.coursework.students'
      );
      provider.addScope(
        'https://www.googleapis.com/auth/classroom.coursework.me'
      );
    }
    const data = await app.auth.signInWithPopup(provider);
    const { displayName, providerData, uid, photoURL, email } = data.user;
    const { accessToken } = data.credential as any;
    const username = email.split('@');

    const [userData] = await getUsers({ email });
    if (userData) {
      return {
        status: true,
        alreadyExists: true,
        message: 'User with given email address already exists!'
      };
    } else {
      if (userId) {
        const body = {
          userId,
          email,
          name: displayName,
          password: null,
          username: username[0],
          authProvider: Types.UserAuthProviders.GOOGLE,
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
              providerId: 'google.com',
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
          }
        } catch (e) {
          console.log('error updating email: ', e.message);
        }
      } else {
        const tokenData = {
          uid,
          name: displayName,
          email: email,
          schoolId: null,
          providerId: providerData[0].providerId,
          contactNumber: null,
          role,
          imageUrl: photoURL,
          token: accessToken
        };
        const token = await storeToken(tokenData, '');
        return {
          status: true,
          alreadyExists: false,
          data: {
            ...token,
            token: accessToken
          }
        };
      }
    }
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
