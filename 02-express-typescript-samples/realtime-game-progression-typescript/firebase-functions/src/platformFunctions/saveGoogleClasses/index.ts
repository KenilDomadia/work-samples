import * as utils from '../../../../utils/src';
import {authorize} from '../../common/ClassroomAuthentication';
import {responseError} from '../../common';
import {IncomingRequest} from '../../common/TypesAndIdentifiers';
import * as adminUtils from '../../admin-utils';
import {Types} from '../../../../utils/src/identifiers';
const { google } = require('googleapis');
const saveGoogleClasses = async (request: IncomingRequest) => {
  const { crt, userId } = request.query;
  const { classList, teacherId, schoolId } = request.body;
  let auth, requestClassList;
  if (crt) {
    auth = await authorize(crt);
  } else if (userId) {
    const accessToken = await adminUtils.getAccessToken(userId);
    auth = await authorize(accessToken);
  } else {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      'missing crt or userId in query parameters'
    );
  }
  try {
    requestClassList = classList.map(cls => {
      return {
        id: cls.id
      };
    });
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      'Unable to parse classList',
      e
    );
  }
  const classroom = google.classroom({ version: 'v1', auth });
  const classes = [];
  // get class data from google
  try {
    for (const classObj of requestClassList) {
      await new Promise((resolve, reject) => {
        classroom.courses.get({ id: classObj.id }, (err, res) => {
          if (!err) {
            classes.push(res.data);
            resolve();
          } else {
            reject(err);
          }
        });
      });
    }
  } catch (e) {
    throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument,
      'Cannot get classroom courses using given crt token. Please retry with new token',
      e.message);
  }
  const promiseArr: any[] = [];
  // get student list from each class
  classes.forEach(cls => {
    cls.students = [];
    promiseArr.push(
      new Promise((resolve, reject) => {
        classroom.courses.students.list({ courseId: cls.id }, (err, res) => {
          if (err) {
            throw new responseError.HttpsError(
              responseError.FunctionsErrorCode.invalid_argument,
              'The google API returned an error ',
              err
            );
          }
          if (res.data.students) {
            cls.students = res.data.students.map(student => {
              return {
                name: student.profile.name.fullName,
                email: student.profile.emailAddress,
                password: Math.random().toString(36).slice(-6),
                googleClassRoomStudentData: student
              };
            });
          }
          resolve();
          return;
        });
      })
    );
  });
  await Promise.all(promiseArr);
  console.log('classes : ', classes);
  // console.log('classes fetched : ', classes.map(cls => cls.id));
  // add course and students to database
  try {
    const allCoursesInfo: any = [];
    for (const cls of classes) {
      console.log('adding class', cls.id);
      const courseInfo = await addClassToAllCollections(cls, teacherId || request.user, schoolId);
      console.log('CourseInfo', courseInfo);
      allCoursesInfo.push(courseInfo);
    }
    return {
      status: true,
      data: allCoursesInfo
    };
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      'Unable to add class, students to the collection',
      e.message
    );
  }
};
async function addClassToAllCollections(cls, user, schoolId): Promise<any> {
  const addCourseResponse = await utils.addCourse({
    name: cls.name,
    teacherId: user,
    description: cls.descriptionHeading,
    enrollmentCode: cls.enrollmentCode,
    grade: cls.grade || '',
    creationMode: utils.Types.CreationModes.GOOGLE_CLASSROOM,
    schoolId,
  });
  const students = cls.students.map(student => {
    const fullName = student.name.split(' ');
    return {
      firstName: fullName[0],
      lastName: fullName[1] || '',
      email: student.email,
      password: student.password
    };
  });
  const addStudentsToCourse =  await utils.addStudentsToCourse({
    courseId: addCourseResponse.id,
    schoolId,
    students,
    providerType: utils.Types.UserAuthProviders.GOOGLE
  });
  const courseDoc = await utils.getCourses({ courseId: addCourseResponse.id });
  const { id, teacherId, } = courseDoc[0];
  if (courseDoc[0].students.length) {
    await utils.addCourseWorks([{
      title: 'ALL OPERATIONS (0-10)',
      assigneeMode: Types.AssigneeModes.INDIVIDUAL_STUDENTS,
      contentId: 'ALL_OPERATIONS',
      courseId: id,
      assignorId: teacherId,
      schoolId,
      assignedStudentIds: courseDoc[0].students,
      description: '',
    }]);
  }
  return {
    course: courseDoc[0],
    students: addStudentsToCourse
  };
}
export default saveGoogleClasses;
