import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces, Types } from './identifiers';
import getUsers from './getUsers';
import addCredentials from './addCredentials';

export default async function loginWithEmail(
  context: DocumentInterfaces.IAuth
): Promise<any> {
  try {
    const { email, password, role } = context;
    try {
      const [userData] = await getUsers({ email });
      if (userData) {
        await app.auth.signInWithEmailAndPassword(email, password);

        const credentials = {
          name: userData.name,
          uid: userData.id,
          role: userData.role,
          email,
          providerId: Types.AuthProviderId.EMAIL,
          schoolId: userData.schoolId,
          contactNumber: userData.primaryNumber
        };
        await addCredentials({ credentials, remember: true });
        return {
          status: true,
          data: {
            ...userData
          }
        };
      } else {
        throw new Error('User not found!');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
