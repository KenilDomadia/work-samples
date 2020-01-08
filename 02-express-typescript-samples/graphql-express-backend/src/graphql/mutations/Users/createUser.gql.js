import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLString
} from 'graphql';
import schemaTypes from '../../schemaTypes';
import {
  createNewMutation
} from '../../__mutationFormat/createNewMutation';

import {
  createUser,
  sendVerificationEmail
} from '../../mutationHelper/User/createUser';

import {
  createAccountForUser
} from '../../mutationHelper/Account/createAccount';

export default createNewMutation({
  name: 'createUser',
  inputFields: {
    birthDate: {
      type: new GraphQLNonNull(GraphQLString)
    },
    cell: {
      type: new GraphQLNonNull(GraphQLString)
    },
    cellVerified: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    country: {
      type: new GraphQLNonNull(GraphQLString)
    },
    countryCode: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    lastName: {
      type: GraphQLString
    },
    gender: {
      type: new GraphQLNonNull(schemaTypes.GenderEnumType)
    }
  },
  outputFields: {
    status: {
      type: GraphQLBoolean,
      resolve: payload => payload.status
    },
    user: {
      type: schemaTypes.UserType,
      resolve: payload => payload.user
    }
  },
  mutateAndGetPayload: async (root, {
    birthDate,
    cell,
    cellVerified,
    country,
    countryCode,
    email,
    firstName,
    gender,
    lastName,
  }) => {
    try {
      const newUser = await createUser({
        birthDate,
        cell,
        cellVerified,
        country,
        countryCode,
        email,
        firstName,
        gender,
        lastName,
      });
      if (cellVerified) {
        await createAccountForUser(newUser);
      }
      await sendVerificationEmail(newUser);
      return {
        status: true,
        user: newUser
      };
    } catch (error) {
      console.error('error in creating a new user', error);
      return {
        user: null,
        status: false
      };
    }
  }
});
