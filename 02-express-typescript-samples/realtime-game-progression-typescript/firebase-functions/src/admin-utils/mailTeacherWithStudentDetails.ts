import { parse } from 'json2csv';
import { responseError } from '../common';
import sendEmail from './sendEmail';

export default async function mailTeacherWithStudentDetails(studentInfo: { name: string, username: string, password: string }[], teacherEmail: string) {

    // convert to CSV
    const fields = ['name', 'username', 'password'];
    const opts = { fields };
    let csv;
    try {
        csv = parse(studentInfo, opts);
        console.log('csv : ', csv);
    }
    catch (e) {
        console.log(`Error ocured while converting json to csv : ${e.message}`);
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.internal, e.message, 'Error occured while parsing JSON data to CSV');
    }

    // send email
    const sendMailResponse = await sendEmail({
        to: teacherEmail,
        attachments: [{
            filename: 'Students.csv',
            content: csv,
        }],
        subject: `Students Roster`,
        text: `Please refer attachment for information about the students added to your class.`
    });
    return { mailResponseCode: sendMailResponse[0].statusCode };
}