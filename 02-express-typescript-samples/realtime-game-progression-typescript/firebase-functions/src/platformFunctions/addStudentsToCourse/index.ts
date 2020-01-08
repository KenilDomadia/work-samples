import * as utils from '../../../../utils/src';
import * as adminUtils from '../../admin-utils';
import { IncomingRequest } from '../../common/TypesAndIdentifiers';
import { responseError } from '../../common';



export default async (request: IncomingRequest) => {
  const { newStudents, existingStudents, courseId, schoolId, providersType } = request.body;

  try {
    const studentsList = await adminUtils.addStudentsToCourse(newStudents, existingStudents, courseId, schoolId, providersType);

    // fetch teacher data
    const getCourseInfo = await utils.getCourses({ courseId });
    const teacherId = getCourseInfo[0].teacherId;
    const teacherData = await utils.getUsers({
      userId: teacherId,
      role: utils.Types.UserPermissionRoles.TEACHER
    });
    const studentDataToMail = studentsList.map(student => {
      return {
        name: student.name,
        username: student.username,
        password: student.password
      };
    });

    if (!teacherData.length) {
      throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument,
        'Teacher Data is an Empty Array');
    }

    await adminUtils.mailTeacherWithStudentDetails(studentDataToMail, teacherData[0].email);
    return { studentsList };
  } catch (e) {
    throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument,
      e.message);
  }
}


