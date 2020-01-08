import {
  GraphQLEnumType
} from 'graphql';
import GenderEnum from '../../../../common/Models/Users/enums/UserGenderEnum';

export default new GraphQLEnumType({
  name: 'GenderEnum',
  description: 'Type of Currency',
  values: {
    male: {
      value: GenderEnum.MALE
    },
    female: {
      value: GenderEnum.FEMALE
    },
    others: {
      value: GenderEnum.OTHERS
    }
  }
});
