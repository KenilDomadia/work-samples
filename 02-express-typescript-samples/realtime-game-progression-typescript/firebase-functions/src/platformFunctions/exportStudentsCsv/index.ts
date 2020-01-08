import * as utils from '../../../../utils/src';
import { IncomingRequest } from '../../common/TypesAndIdentifiers';
import { generateCsv } from '../../admin-utils/';

export default async (request: IncomingRequest) => {
  const { courseId } = request.body;
  const studentsList = await utils.getUsers({
    courseId,
    role: utils.Types.UserPermissionRoles.STUDENT
  });
  console.log('studentsList : ', studentsList);

  const csv = generateCsv(studentsList, ['name', 'username', 'password']);
  return { fileData: csv, fileName: 'students.csv' };
}