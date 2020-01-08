import * as responseError from './common/responseError';
import { DocumentInterfaces } from './identifiers';

export interface IRefreshToken {
  email: string;
  refreshToken: string;
}


export default async function addCredentials({
  credentials,
  remember
}: DocumentInterfaces.ICredentialsSet): Promise<any> {
  try {
    const credentialsKey = 'credentials';
    let timer: any;
    if (credentials) {
      if (remember) {
        localStorage.setItem(credentialsKey, JSON.stringify(credentials));
      } else {
        sessionStorage.setItem(credentialsKey, JSON.stringify(credentials));
      }

      // clear the refresh timer
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      // start the refresh timer for the credentials
      // timer = setTimeout(() => {
      //   const { refreshToken, email } = _credentials;
      //   return refreshAuthToken({ refreshToken, email });
      // }, 55 * 1000 * 60);
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
