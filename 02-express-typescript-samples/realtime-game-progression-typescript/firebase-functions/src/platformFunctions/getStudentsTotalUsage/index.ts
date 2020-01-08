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
                total_usage: {
                    buckets
                }
            }
        } = await ElasticHelper.searchWithIndex(indexName, query(schoolId, courseId, courseWorkId));

        // The response body we currently construct is of form:
        // RESPONSE:
        // [
        //     {
        //         '[studentId]': { 'total_usage': 3 }
        //     },
        //     {
        //         '[studentId]': { 'total_usage': 1 }
        //     },
        //     ...
        // ]
        return buckets.map(student => ({ [student['key']]: { total_usage: student['stats']['count'] } }));
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

// TODO: A better way to query the result?
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
                ]
            }
        },
        'aggs': {
            'total_usage': {
                'terms': {
                    'field': 'studentId',
                    'size': 10000
                },
                'aggs': {
                    'usage': {
                        'date_histogram': {
                            'field': 'timestamp',
                            'interval': 'day',
                            'min_doc_count': 1
                        },
                        'aggs': {
                            'days_count': {
                                'cardinality': {
                                    'field': 'timestamp'
                                }
                            }
                        }
                    },
                    'stats': {
                        'stats_bucket': {
                            'buckets_path': 'usage>days_count'
                        }
                    }
                }
            }
        }
    };
}
