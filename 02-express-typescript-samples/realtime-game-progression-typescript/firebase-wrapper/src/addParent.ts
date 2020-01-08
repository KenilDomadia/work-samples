import * as responseError from './common/responseError';
import { DocumentInterfaces, Types } from './identifiers';
import getUsers from './getUsers';
import { app } from './app';
import addUser from './addUser';
import updateUser from './updateUser';

const parentDefaultPassword = 'factflow';

export default async function addParent(
  context: DocumentInterfaces.IAddParent
): Promise<any> {
  try {
    const { email, phoneNumber, childId } = context;
    const childDoc = await getUsers({ userId: childId });
    if (childDoc.length === 0) {
      return new Error('User with given id does not exist in the database');
    } else {
      const { parentId } = childDoc[0];
      if (parentId) {
        // Parent is already linked with child
        const parentDoc = await getUsers({ userId: parentId });
        if (phoneNumber) {
          const userDocUsingPhoneNumber = await getUsers({ phoneNumber });
          if (userDocUsingPhoneNumber.length > 0) {
            // Entered phoneNumber is linked with another account
            return {
              status: false,
              alreadyExists: true,
              message: Types.AddParentErrors.CONTACT_NUMBER_LINKED
            }
          } else {
            // Link phone Number with existing parent doc
            const userObj = {
              contactNumber: phoneNumber
            };
            const updatedParentDoc = await updateUser(parentDoc[0].id, userObj);
            return {
              status: true,
              alreadyExists: true,
              data: [
                updatedParentDoc,
                childDoc[0]
              ]
            }
          }
        } else if (email) {
          const userDocUsingEmail = await getUsers({ email });
          if (userDocUsingEmail.length > 0) {
            // Entered Email is already linked with another account
            return {
              status: false,
              alreadyExists: true,
              message: Types.AddParentErrors.EMAIL_LINKED
            }
          } else {
            // Link email with existing parent doc
            const updatedParentDoc = await createNewAccountUsingEmailId(parentDoc[0], email, childId);
            return {
              status: true,
              alreadyExists: true,
              data: [
                updatedParentDoc,
                childDoc[0]
              ]
            }
          }
        }
      } else {
        // ChildDoc does not have parent Id
        if (phoneNumber && email) {
          // Entered both phone number and email
          const userDocByPhoneNumber = await getUsers({ phoneNumber });
          const userDocByEmail = await getUsers({ email });
          if (userDocByEmail.length > 0 && userDocByPhoneNumber.length > 0) {
            // Both phoneNumber and email is linked with another account
            if (userDocByEmail[0].id === userDocByPhoneNumber[0].id) {
              const updatedParentDoc = await updateUser(userDocByEmail[0].id, { childId });
              const updatedChildDoc = await updateUser(childId, { parentId: userDocByEmail[0].id });
              return {
                status: true,
                alreadyExists: true,
                data: [
                  updatedParentDoc,
                  updatedChildDoc
                ]
              }
            } else {
              return {
                status: false,
                alreadyExists: true,
                message: Types.AddParentErrors.CONTACT_AND_EMAIL_LINKED
              }
            }
          } else if (userDocByEmail.length === 0 && userDocByPhoneNumber.length === 0) {
            // Create a new account with email Id and phone number
            const response = await getNewParentDocUsingEmailId(email, childId, phoneNumber);
            return response;
          } else {
            if (userDocByPhoneNumber.length > 0) {
              // Link email with parent doc
              if (userDocByPhoneNumber[0].email) {
                return {
                  status: false,
                  alreadyExists: true,
                  message: Types.AddParentErrors.EMAIL_LINK_ERROR
                }
              }
              const updatedParentDoc = await createNewAccountUsingEmailId(userDocByPhoneNumber[0], email, childId);
              const updatedChildDoc = await updateUser(childId, { parentId: userDocByPhoneNumber[0].id }); 
              return {
                status: true,
                alreadyExists: true,
                data: [
                  updatedParentDoc,
                  updatedChildDoc
                ]
              }
            } else if(userDocByEmail.length > 0) {
              // Link contact number with parent doc
              if (userDocByEmail[0].primaryNumber) {
                return {
                  status: false,
                  alreadyExists: true,
                  message: Types.AddParentErrors.CONTACT_NUMBER_LINK_ERROR
                }
              }
              const userObj = {
                contactNumber: phoneNumber,
                children: [childId]
              };
              const updatedParentDoc = await updateUser(userDocByEmail[0].id, userObj);
              const updatedChildDoc = await updateUser(childId, { parentId: userDocByEmail[0].id });
              return {
                status: true,
                alreadyExists: true,
                data: [
                  updatedParentDoc,
                  updatedChildDoc
                ]
              }
            }
          }
        } else if (phoneNumber) { 
          const userDocResponse = await getUsers({ phoneNumber });
          if (userDocResponse.length > 0) {
            // Link child with parent as phone Number is already existing in another account
            const userDoc = userDocResponse[0];
            const { updatedParentDoc, updatedChildDoc } = await linkParentChild(userDoc.id, childId);
            return {
              status: true,
              alreadyExists: true,
              data: [
                updatedParentDoc,
                updatedChildDoc
              ]
            };
          } else {
            // Phone number is not registered with any account so create a new account
            const response = getNewParentDocUsingContactNumber(
              phoneNumber,
              childId
            );
            return response;
          }
        } else if (email) {
          const userDocResponse = await getUsers({ email });
          if (userDocResponse.length > 0) {
            // Link child with parent as email is already existing in another account
            if (userDocResponse[0].role === Types.UserPermissionRoles.PARENT) {
              const userDoc = userDocResponse[0];
              const { updatedParentDoc, updatedChildDoc } = await linkParentChild(userDoc.id, childId);
              return {
                status: true,
                alreadyExists: true,
                data: [
                  updatedParentDoc,
                  updatedChildDoc
                ]
              };
            } else {
              return {
                status: false,
                alreadyExists: true,
                message: Types.AddParentErrors.EMAIL_LINKED
              }
            }
          } else {
            // Email is not registered with any account so create a new account
            const response = await getNewParentDocUsingEmailId(email, childId);
            return response;
          }
        }
      }
    }
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}

async function linkParentChild(
  parentId: string,
  childId: string
): Promise<any> {
  try {
    const updatedChildDoc = await updateUser(childId, { parentId });
    const updatedParentDoc = await updateUser(parentId, { childId });
    return {
      updatedParentDoc,
      updatedChildDoc
    };
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}

async function getNewParentDocUsingEmailId(email, childId, phoneNumber?: string): Promise<any> {
  try {
    const data = await app.auth.createUserWithEmailAndPassword(
      email,
      parentDefaultPassword
    );
    const { displayName, uid } = data.user;
    let userObj: Partial<DocumentInterfaces.IUsersDoc> = {
      name: displayName,
      email,
      password: parentDefaultPassword,
      role: Types.UserPermissionRoles.PARENT,
      providerIds: {
        email: uid,
        google: null,
        clever: null,
        phone: null,
        facebook: null
      },
      children: [childId]
    };
    if (phoneNumber) {
      userObj.primaryNumber = phoneNumber;
    }
    const newParentDoc = await addUser(userObj);
    const updatedChildDoc = await updateUser(childId, { parentId: newParentDoc.id });
    return {
      status: true,
      alreadyExists: false,
      data: [
        newParentDoc,
        updatedChildDoc
      ]
    };
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}

async function getNewParentDocUsingContactNumber(
  phoneNumber,
  childId
): Promise<any> {
  try {
    const userObj: Partial<DocumentInterfaces.IUsersDoc> = {
      role: Types.UserPermissionRoles.PARENT,
      providerIds: {
        email: null,
        google: null,
        clever: null,
        phone: null
      },
      primaryNumber: phoneNumber,
      children: [childId]
    };
    const newParentDoc = await addUser(userObj);
    const updatedChildDoc = await updateUser(childId, { parentId: newParentDoc.id });
    return {
      status: true,
      alreadyExists: false,
      data: [
        newParentDoc,
        updatedChildDoc
      ]
    };
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}

async function createNewAccountUsingEmailId(parentDoc, email, childId) {
  try {
    const data = await app.auth.createUserWithEmailAndPassword(
      email,
      parentDefaultPassword
    );
    const { displayName, uid } = data.user;
    const userObj: Partial<DocumentInterfaces.IUsersDoc> = {
      name: parentDoc.name || displayName,
      email,
      password: parentDefaultPassword,
      providerIds: {
        email: uid,
        google: null,
        clever: null,
        phone: null,
        facebook: null
      },
      children: app.firestoreFieldValue.arrayUnion(childId)
    }
    const updatedParentDoc = await app.firestore.collection('users').doc(parentDoc.id).set({...userObj}, { merge: true });
    return updatedParentDoc;
  } catch(e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}