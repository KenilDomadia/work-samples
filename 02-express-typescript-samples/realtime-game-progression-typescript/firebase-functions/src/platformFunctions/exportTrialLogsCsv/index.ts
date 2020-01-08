import * as utils from '../../../../utils/src';
import { IncomingRequest } from '../../common/TypesAndIdentifiers';
import { generateCsv } from '../../admin-utils/';

export interface IGetTrialLogsQuery {
    userId?: string;
    courseWorkId?: string;
    tags?: string[];
    event_time?: boolean;
}

export interface IGetTrialLogsOptions {
    startAfterTimestamp?: string;
    limit?: number;
}

export default async (request: IncomingRequest) => {
    const { userId, courseWorkId, tags, event_time } = request.body;

    console.log('getting trial logs...');

    const trialLogs = await utils.getTrialLogs({
        userId,
        courseWorkId,
        tags,
        event_time
    }, {});

    console.log('updating trial logs... ', trialLogs);

    const updatedTrialLogs = trialLogs.map((trialLog) => {
        for (const key in trialLog.response) {
            trialLog[key] = trialLog.response[key];
        }
        delete trialLog.response;
        return trialLog;
    });

    console.log('trialLogs updated... ', updatedTrialLogs);

    if (updatedTrialLogs.length) {
        const csv = generateCsv(updatedTrialLogs);
        return { fileData: csv, fileName: 'trialLogs.csv' };
    } else {
        return { message: 'No trial logs found with given options' };
    }
}