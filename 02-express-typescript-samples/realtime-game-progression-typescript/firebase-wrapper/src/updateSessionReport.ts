import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces } from './identifiers';
import addSessionReport from './addSessionReport';

export default async function updateSessionReport(
  studentId: string,
  report: Partial<DocumentInterfaces.ISessionReportDoc>
): Promise<any> {
  try {
    const sessionReportRef = app.firestore.collection(`sessionReports`);
    const sessionReportDocs = await sessionReportRef
      .where('studentId', '==', studentId)
      .get();
    if (sessionReportDocs.empty) {
        // create sessionReport , if not exist
        const sessionReport = await addSessionReport({ studentId, report });
        return {
          status: true,
          data: {
            report: sessionReport
          }
        };
    } else {
        const result = sessionReportDocs.docs.map(sessionReportDoc => {
            return { id: sessionReportDoc.id, ...sessionReportDoc.data() };
        })[0];
        await sessionReportRef.doc(result.id).set(report, { merge: true });
        const updatedSessionReport = await sessionReportRef.doc(result.id).get();
        return {
            status: true,
            data: {
                report: updatedSessionReport.data()
            }
        };
    }
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
