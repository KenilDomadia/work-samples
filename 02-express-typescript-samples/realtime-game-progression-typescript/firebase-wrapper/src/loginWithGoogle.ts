import * as responseError from './common/responseError';
import getUsers from './getUsers';
import { app } from './app';
import storeToken from './storeToken';
import { Types } from './identifiers';
import addCredentials from './addCredentials';
interface IGoogleAuthQueryParams {
  role: Types.UserPermissionRoles;
  isReSync?: boolean;
  userId?: string;
}

export default async function loginWithGoogle(
  params: IGoogleAuthQueryParams
): Promise<any> {
  try {
    const { role, isReSync, userId } = params;
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

    if (isReSync) {
      return {
        status: true,
        data: {
          token: accessToken
        }
      };
    } else {
      const [userData] = await getUsers({ email });
      if (userData) {
        const credentials = {
          name: userData.name,
          uid: userData.id,
          role: userData.role,
          email: userData.email,
          providerId: 'google.com',
          schoolId: userData.schoolId,
          contactNumber: userData.primaryNumber
        };
        await addCredentials({ credentials, remember: true });
        return {
          status: true,
          alreadyExists: true,
          data: {
            ...userData
          }
        };
      } else {
        return {
          status: true,
          alreadyExists: false,
          message: 'User not found!'
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
