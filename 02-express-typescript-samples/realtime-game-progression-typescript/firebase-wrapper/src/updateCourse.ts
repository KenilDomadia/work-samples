import { app } from './app';
import * as responseError from './common/responseError';
import { Types } from './identifiers';
import filterUndefinedKeys from './common/filterUndefinedKeys';

export interface ICourseUpdateQuery {
  name?: string;
  noOfStudents?: number;
  courseState?: Types.CourseStates;
  googleClassRoomInfo?: string;
}

export default async function updateCourse(courseId: string, {
  name,
  noOfStudents,
  courseState,
  googleClassRoomInfo
}: ICourseUpdateQuery): Promise<{ id: string, message: string }> {
  try {
    const courseRef = app.firestore.collection('courses').doc(courseId);
    const sourceObj: any = {
      name,
      noOfStudents,
      courseState,
      googleClassRoomInfo,
      updateTime: new Date().toISOString()
    };
    const updateObj = filterUndefinedKeys(sourceObj);
    await courseRef.update(updateObj);
    return { id: courseId, message: 'Doc has been updated successfully.' };

  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
