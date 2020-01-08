import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces } from './identifiers';


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

export default async function xgetTrialLogs(query: Partial<IGetTrialLogsQuery>,
    options: IGetTrialLogsOptions
): Promise<DocumentInterfaces.ITrialLogDoc[]> {
    try {
        const { userId, courseWorkId, tags = [], event_time } = query;
        const { limit, startAfterTimestamp } = options;
        let trialLogsRef = await app.firestore.collection('trialLogs').orderBy('event_time');
        //trialLogsRef = trialLogsRef.where('event_time', '==', false);
        if (limit) {
            trialLogsRef = trialLogsRef.limit(limit);
        }

        if (userId) {
            trialLogsRef = trialLogsRef.where('userId', '==', userId);
        }

        if (courseWorkId) {
            trialLogsRef = trialLogsRef.where('courseWorkId', '==', courseWorkId);
        }
        // Pass the value of last x_trial_start_timestamp to get logs for next limit.
        if (startAfterTimestamp) {
            trialLogsRef = trialLogsRef.startAfter(startAfterTimestamp);
        }

        if (event_time) {
            trialLogsRef = trialLogsRef.where('event_time', '<', new Date().toISOString())
        }
        let results = [];
        if (tags.length) {
            const trialLogsPromises = [];
            for (const tag of tags) {
                trialLogsPromises.push(trialLogsRef.where('tags', 'array-contains', tag).get());
            }
            const trialLogsResolved = await Promise.all(trialLogsPromises);
            for (const trialLogResolved of trialLogsResolved) {
                for (const trialLogDoc of trialLogResolved.docs) {
                    if ((results.findIndex(result => result.id === trialLogDoc.id) === -1)) {
                        results.push({
                            id: trialLogDoc.id,
                            ...trialLogDoc.data()
                        });
                    }
                }
            }
        } else {
            const trialLogDocs = await trialLogsRef.get();
            results = trialLogDocs.docs.map(trialLogDoc => {
                return { id: trialLogDoc.id, ...trialLogDoc.data() } as DocumentInterfaces.ITrialLogDoc;
            });
        }
        return results;
    } catch (e) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.invalid_argument,
            e.message
        );
    }
}
