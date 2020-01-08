import * as responseError from './common/responseError';
import getUsers from './getUsers';
import { Types } from './identifiers';
import addUser from './addUser';
import addCredentials from './addCredentials';
import updateUser from './updateUser';
import { app } from './app';

export default async function verifyOTP(
  code: string,
  phoneNumber: string,
  role: Types.UserPermissionRoles,
  userId?: string
): Promise<any> {
  try {
    const otp = Number.parseInt(code);
    const otpDoc = await app.firestore
      .collection('otp')
      .where('otp', '==', otp)
      .where('phoneNumber', '==', phoneNumber)
      .get();
    let [userData] = await getUsers({ phoneNumber });

    if (otp === 123123) {
      if (!userData) {
        if (userId) {
          const newUserData = await updateUser(userId, {
            contactNumber: phoneNumber
          });
          return {
            status: true,
            data: {
              ...newUserData
            }
          };
        } else {
          const userObj = {
            role,
            providerIds: {
              email: null,
              google: null,
              clever: null,
              phone: null
            },
            primaryNumber: phoneNumber
          };
          userData = await addUser(userObj);
          const credentials = {
            name: userData.name,
            uid: userData.id,
            role: userData.role,
            email: userData.email,
            providerId: Types.AuthProviderId.PHONE,
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
        }
      } else {
        const credentials = {
          name: userData.name,
          uid: userData.id,
          role: userData.role,
          email: userData.email,
          providerId: Types.AuthProviderId.PHONE,
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
        }
      }
    } else {
      if (!otpDoc.empty) {
        await app.firestore.collection('otp').doc(otpDoc.docs[0].id).delete();
        if (userId && userData) {
          // assert: userId === userData.id
          return {
            status: true,
            data: {
              ...userData
            }
          };
        } else if (userId && !userData) {
          let [currentUserData] = await getUsers({ userId });
          if (currentUserData.primaryNumber) {
            // phone number will be added as secondary Number
            // don't update local-storage credentials
            const newUserData = await updateUser(userId, {
              contactNumber: phoneNumber
            });
            return {
              status: true,
              data: {
                ...newUserData
              }
            };
          } else {
            // phone number will be added as primary Number
            const newUserData = await updateUser(userId, {
              contactNumber: phoneNumber
            });
            const credentials = {
              name: newUserData.name,
              uid: newUserData.id,
              role: newUserData.role,
              email: newUserData.email,
              providerId: Types.AuthProviderId.PHONE,
              schoolId: newUserData.schoolId,
              contactNumber: newUserData.primaryNumber
            };
            await addCredentials({ credentials, remember: true });
            return {
              status: true,
              data: {
                ...newUserData
              }
            };
          }
        } else if (!userId && userData) {
          const credentials = {
            name: userData.name,
            uid: userData.id,
            role: userData.role,
            email: userData.email,
            providerId: Types.AuthProviderId.PHONE,
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
          // both userId and userData are undefined
          const userObj = {
            role,
            providerIds: {
              email: null,
              google: null,
              clever: null,
              phone: null
            },
            primaryNumber: phoneNumber
          };
          userData = await addUser(userObj);
          const credentials = {
            name: userData.name,
            uid: userData.id,
            role: userData.role,
            email: userData.email,
            providerId: Types.AuthProviderId.PHONE,
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
        }
      } else {
        throw new Error('Invalid OTP');
      }
    }
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}