import { app, Types } from './app';
import * as responseError from './common/responseError';
import addUser from './addUser';
import addCredentials from './addCredentials';

export interface IToken {
  uid: string;
  name: string;
  email: string;
  schoolId: string;
  providerId: string;
  contactNumber: string;
  role: Types.UserPermissionRoles;
  googleAuthRefreshToken?: string;
  imageUrl?: string;
  token?: string;
}

export default async function storeToken({
  uid,
  name,
  email,
  schoolId,
  providerId,
  contactNumber,
  role,
  googleAuthRefreshToken,
  imageUrl,
  token
}: IToken, password: string): Promise<any> {
  try {
    return app.auth.currentUser.getIdToken(true).then(async _ => {
      // call ppl utils for entry in firestore
      const providerIds =
        providerId === 'password' ? { email: uid, google: null, clever: null } : { email: null, google: uid, clever: null };
      const userData = await addUser({
        name,
        email,
        providerIds,
        role,
        password,
        schoolId: schoolId ? schoolId : null,
        googleAuthRefreshToken: googleAuthRefreshToken || null,
        imageUrl: imageUrl || null
      });
      const credentials = {
        name,
        uid: (userData as any).id,
        role,
        email,
        providerId,
        contactNumber,
        schoolId: schoolId ? schoolId : null,
        token: token || null
      };
      addCredentials({ credentials, remember: true });
      return userData;
    });
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
