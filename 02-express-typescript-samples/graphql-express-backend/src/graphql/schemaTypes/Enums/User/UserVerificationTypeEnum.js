import {
  GraphQLEnumType
} from 'graphql';

const VerificationTypeEnum = {
  CELL: 'cell',
  EMAIL: 'email',
  KYC: 'kyc'
};


export default new GraphQLEnumType({
  name: 'UserVerificationTypeEnum',
  description: 'Verification type of user',
  values: {
    cell: {
      value: VerificationTypeEnum.CELL
    },
    email: {
      value: VerificationTypeEnum.EMAIL
    },
    kyc: {
      value: VerificationTypeEnum.KYC
    }
  }
});
