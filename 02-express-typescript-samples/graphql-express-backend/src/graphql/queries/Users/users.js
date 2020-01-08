import {
  GraphQLList,
  GraphQLString
} from 'graphql';

import {
  UserModel
} from '../../../common/Models/';
import getProjections from '../../getProjectionForNonConnections';
import schemaTypes from '../../schemaTypes';

export default {
  type: new GraphQLList(schemaTypes.UserType),
  args: {
    email: {
      type: GraphQLString
    }
  },
  async resolve(root, params, context, options) {
    const projection = getProjections(options.fieldNodes[0]);
    return UserModel
      .find({})
      .select(projection)
      .lean()
      .exec();
  }
};
