import * as responseError from './common/responseError';
import { Types } from './identifiers';
import * as _ from 'lodash';

export default async function getCourseWorkPerformance(
  schoolId: string,
  courseId: string,
  courseWorkId: string
): Promise<any> {
  try {

    const performanceAndUsageUrls = [
      `${Types.BACKEND_URL}/getStudentsTotalUsage`,
      `${Types.BACKEND_URL}/getStudentsUsage`
    ];

    const fetchResponse = await Promise.all(
      performanceAndUsageUrls.map(url =>
        fetch(url, {
          body: JSON.stringify({
            schoolId, courseId, courseWorkId
          }),
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          }
        })
        .then(async result => {
          const x = await result.json();
          return x.data;
        })
        .catch(console.log)
      )
    ).then(result =>  ({
        res_total_usage: result[0],
        res_usage_stats: result[1]
    }));

    const { res_total_usage, res_usage_stats } = fetchResponse;
    // console.log(res_total_usage, res_usage_stats);
    const performanceAndUsageData = res_total_usage.map(usage => {
      const id = Object.keys(usage)[0];
      const stud_usage = res_usage_stats.filter(s_usage => {
        return Object.keys(s_usage)[0] === id
      })[0];
      const total_usage = usage[id].total_usage;
      const usage_stats = stud_usage[id];
      return {
        id,
        total_usage,
        usage_stats
      }
    });
    // console.log('performanceAndUsageData : ', performanceAndUsageData);
    return performanceAndUsageData;
  } catch (error) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      error.message
    );
  }
}