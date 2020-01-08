import ElasticHelper from '../../admin-utils/elasticHelper';
import { responseError } from '../../common';
import { IncomingRequest } from '../../common/TypesAndIdentifiers';

export default async (request: IncomingRequest) => {
    const { schoolId, courseId, courseWorkId } = request.body;

    // verify that we receive all the necessary info required to carry out the es query
    if (!schoolId || !courseId || !courseWorkId) {
        const message =
            `Invalid arguments for 'schoolId'=${schoolId}, 'courseId'=${courseId} and 'courseWorkId'=${courseWorkId}`;
        throw new responseError.HttpsError(responseError.FunctionsErrorCode.invalid_argument, message);
    }

    try {
        ElasticHelper.init();
        const indexName = '.trial_logs';

        // TODO: Should we manually create the index and add mappings or should
        //  we make an extra request to es to check if index already exists?
        //                                  OR
        //  Create all the indexes with their respective mappings once after the
        //  es client is initialized to avoid checking index on every request.
        const indexExists = await ElasticHelper.isIndexExists(indexName);
        if (!indexExists) {
            await ElasticHelper.createIndex(indexName, body());
        }

        const {
            aggregations: {
                students: {
                    buckets
                }
            }
        } = await ElasticHelper.searchWithIndex(indexName, query(schoolId, courseId, courseWorkId));

        // The response body we currently construct is of form:
        // RESPONSE:
        // [
        //     {
        //         '1': [
        //             {
        //                 'date': '2019-08-03',
        //                 'timestamp': 1564790400000,
        //                 'trials_played': 1,
        //                 'active': true
        //             },
        //             ...values for last 7 days
        //          ]
        //      },
        //      ...other students
        // ]
        return buckets.map(student => {
            const usage = student.usage.buckets.map(bucket => ({
                date: bucket['key_as_string'],
                timestamp: bucket['key'],
                trials_played: bucket['doc_count'],
                active: bucket['doc_count'] > 0,
            }));
            return { [student.key]: usage };
        });
    } catch (error) {
        throw new responseError.HttpsError(
            responseError.FunctionsErrorCode.internal,
            'An error occurred while fetching response',
            error // TODO: Return error details in debug config only.
        );
    }
}

function body() {
    // TODO: Dynamically setting the number of shards and replicas
    //   according to the number of es nodes will allow us to always
    //   maintain the index health as 'green'.
    return {
        'settings': {
            'index': {
                'number_of_shards': 1,
                'number_of_replicas': 0
            }
        },
        'mappings': {
            '_doc': {
                'properties': {
                    'timestamp': {
                        'type': 'date',
                    },
                    'studentId': {
                        'type': 'keyword'
                    },
                    'courseId': {
                        'type': 'keyword'
                    },
                    'schoolId': {
                        'type': 'keyword'
                    },
                    'courseWorkId': {
                        'type': 'keyword'
                    },
                    'questionId': {
                        'type': 'keyword'
                    },
                    'response': {
                        'properties': {
                            'response_type': {
                                'type': 'keyword'
                            }
                        }
                    }
                }
            }
        }
    };
}

function query(schoolId: string, courseId: string, courseWorkId: string) {
    return {
        'size': 0,
        'query': {
            'bool': {
                'must': [
                    {
                        'term': {
                            'schoolId': {
                                'value': `${schoolId}`
                            }
                        }
                    },
                    {
                        'term': {
                            'courseId': {
                                'value': `${courseId}`
                            }
                        }
                    },
                    {
                        'term': {
                            'courseWorkId': {
                                'value': `${courseWorkId}`
                            }
                        }
                    }
                ],
                'filter': {
                    'range': {
                        'timestamp': {
                            'gte': 'now-6d/d',
                            'lte': 'now/d'
                        }
                    }
                }
            }
        },
        'aggs': {
            'students': {
                'terms': {
                    'field': 'studentId',
                    'size': 10000
                },
                'aggs': {
                    'usage': {
                        'date_histogram': {
                            'field': 'timestamp',
                            'interval': 'day',
                            'format': 'yyyy-MM-dd',
                            'order': {
                                '_key': 'asc'
                            },
                            'min_doc_count': 0,
                            'extended_bounds': {
                                'min': 'now-6d/d',
                                'max': 'now/d'
                            }
                        }
                    }
                }
            }
        }
    };
}
