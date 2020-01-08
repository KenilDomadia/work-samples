import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces, Types } from './identifiers';
import updateCourse from './updateCourse';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export default async function addCourse({
    name,
    districtId = null,
    schoolId,
    sisId = null,
    subject = 'Math',
    students = [],
    teachers = [],
    teacherId,
    grade,
    description = null,
    enrollmentCode,
    creationMode = Types.CreationModes.MANUAL,
    noOfStudents = 0,
    courseState = Types.CourseStates.ACTIVE,
    googleClassRoomInfo = null,
    creationTime = new Date().toISOString(),
    updateTime = new Date().toISOString()
}: Omit<DocumentInterfaces.ICourseDoc, 'id'>): Promise<DocumentInterfaces.ICourseDoc> {
  try {
      teachers.push(teacherId);
      const courseObj = {
          name,
          districtId,
          schoolId,
          sisId,
          subject,
          students,
          teacherId,
          teachers,
          grade,
          description,
          enrollmentCode,
          creationMode,
          noOfStudents,
          courseState,
          googleClassRoomInfo,
          creationTime,
          updateTime
      };
      const coursesWithSameEnrollmentCode = await app.firestore.collection('courses')
          .where('enrollmentCode', '==', enrollmentCode)
          .where('teacherId', '==', teacherId)
          .get();
      if (coursesWithSameEnrollmentCode.empty) {
          return await createCourseDoc(courseObj);
      } else {
          console.log('Course with given enrollmentCode already exists.');
          return await updateExistingCourseSDoc(coursesWithSameEnrollmentCode, courseObj);
      }
  } catch (e) {
    throw new responseError.HttpsError(
        responseError.FunctionsErrorCode.invalid_argument,
        e.message
    );
  }
}

async function createCourseDoc(insertObj: Omit<DocumentInterfaces.ICourseDoc, 'id'>): Promise<DocumentInterfaces.ICourseDoc> {
    const courseDoc = await app.firestore.collection('courses').add(insertObj);
    return { id: courseDoc.id, ...insertObj };
}

async function updateExistingCourseSDoc(
    coursesWithSameEnrollmentCode: firebase.firestore.QuerySnapshot,
    insertObj: Omit<DocumentInterfaces.ICourseDoc, 'id'>
): Promise<DocumentInterfaces.ICourseDoc> {
    for (const courseWithSameEnrollmentCode of coursesWithSameEnrollmentCode.docs) {
        const updateObj = {
          name: insertObj.name,
          noOfStudents: insertObj.noOfStudents,
          courseState: insertObj.courseState,
          googleClassRoomInfo: insertObj.googleClassRoomInfo
        };
        await updateCourse(courseWithSameEnrollmentCode.id, updateObj);
    }
    return { id: coursesWithSameEnrollmentCode.docs[0].id, ...insertObj };
}
