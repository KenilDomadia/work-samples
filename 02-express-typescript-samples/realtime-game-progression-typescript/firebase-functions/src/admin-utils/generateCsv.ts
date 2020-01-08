import { responseError } from '../common';
import { parse } from 'json2csv';

export function generateCsv(data: any, fields?: string[]) {
    const opts = { fields };
    try {
        const csv = parse(data, opts);
        return csv;
    } catch (e) {
        console.log(`Error ocured while converting json to csv : ${e.message}`);
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.internal,
            e.message,
            'Error occured while parsing JSON data to CSV');
    }
}