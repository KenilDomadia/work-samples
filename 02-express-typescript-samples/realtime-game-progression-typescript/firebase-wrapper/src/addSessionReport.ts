import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces } from './identifiers';

interface Report {
    studentId: string,
    report?: Partial<DocumentInterfaces.ISessionReportDoc>
}

export default async function addSessionReport({
    studentId,
    report
}: Report): Promise<DocumentInterfaces.ISessionReportDoc> {
    try {
        const data: DocumentInterfaces.ISessionReportDoc = {
            studentId,
            weeklyQuizReports: report ? report.weeklyQuizReports : {},
            dailyPracticeReports: report ? report.dailyPracticeReports : {},
            childPracticeReports: report ? report.childPracticeReports : {}
        };
        const docRef = await app.firestore.collection(`sessionReports`).add(data);
        console.log('Document written with ID: ', docRef.id);
        return { ...data };
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
