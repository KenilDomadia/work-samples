import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import UserDataLoader from '../../../common/Dataloaders/user';
import schemaTypes from '../../schemaTypes';

export default {
  type: schemaTypes.UserType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  async resolve(root, params) {
    return UserDataLoader.loadUserById.load(params.id);
  }
};
