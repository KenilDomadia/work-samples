import {
  GraphQLEnumType
} from 'graphql';
import UserStatusEnum from '../../../../common/Models/Users/enums/UserStatusEnum';

export default new GraphQLEnumType({
  name: 'UserStatusEnum',
  description: 'Status of user',
  values: {
    active: {
      value: UserStatusEnum.ACTIVE
    },
    blocked: {
      value: UserStatusEnum.BLOCKED
    },
    deleted: {
      value: UserStatusEnum.DELETED
    },
    suspended: {
      value: UserStatusEnum.SUSPENDED
    }
  }
});
