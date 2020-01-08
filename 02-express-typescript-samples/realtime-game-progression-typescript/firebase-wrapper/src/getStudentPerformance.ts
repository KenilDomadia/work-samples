import * as responseError from './common/responseError';
import { Types } from './identifiers';
import * as _ from 'lodash';

export default async function getStudentsPerformance(
  studentId: string,
  courseId: string,
  courseWorkId: string,
  date: string
): Promise<any> {
  try {

    const performanceAndUsageUrls = [
      `${Types.BACKEND_URL}/getStudentsPerformance`,
    ];

    const studentPerformance = await Promise.all(
      performanceAndUsageUrls.map(url =>
        fetch(url, {
          body: JSON.stringify({
            studentId, courseId, courseWorkId, date
          }),
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          }
        })
        .then(async response => {
          const res = await response.json();
          return res.data;
        })
        .catch(console.log)
      )
    );
    return studentPerformance[0];
  } catch (error) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      error.message
    );
  }
}