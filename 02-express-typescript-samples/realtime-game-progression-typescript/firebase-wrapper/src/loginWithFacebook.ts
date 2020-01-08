import * as responseError from './common/responseError';
import getUsers from './getUsers';
import { app } from './app';
import storeToken from './storeToken';
import { Types } from './identifiers';
import addCredentials from './addCredentials';
interface IFacebookAuthQueryParams {
  role: Types.UserPermissionRoles;
  userId?: string;
}

export default async function loginWithFacebook(
  params: IFacebookAuthQueryParams
): Promise<any> {
  try {
    const provider = new app.authFacebookAuthProvider();
    provider.addScope('email');
    const data = await app.auth.signInWithPopup(provider);
    const { email } = data.user;

    const [userData] = await getUsers({ email });
    if (userData) {
      const credentials = {
        name: userData.name,
        uid: userData.id,
        role: userData.role,
        email: userData.email,
        providerId: 'facebook.com',
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
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
