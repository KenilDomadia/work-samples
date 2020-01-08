import * as elasticsearch from 'elasticsearch';
import * as AWS from 'aws-sdk';
import connectionClass from 'http-aws-es';

export default class ElasticHelper {
  static elasticClient;

  static init() {
    ElasticHelper.elasticClient = ElasticHelper.elasticClient || ElasticHelper.getElasticClient();
  }

  private static getElasticClient() {
    console.log('getting client');
    const aws_region = process.env.AWS_ELASTICSEARCH_REGION || 'us-east-1';
    const aws_es_access_key_id = process.env.ES_AWS_ACCESS_KEY_ID;
    const aws_es_secret_key = process.env.ES_AWS_SECRET_ACCESS_KEY;
    //creating a client to connect to hostedES on AWS
    const elasticClient = new elasticsearch.Client({
      host: 'https://search-ppl-mathfluency-2fc4cun4qkb5hoscgfgklqszeq.us-east-1.es.amazonaws.com',
      log: 'error',
      connectionClass,
      awsConfig: new AWS.Config({
        region: aws_region,
        credentials: new AWS.Credentials(aws_es_access_key_id, aws_es_secret_key)
      })
    });
    return elasticClient;
  }

  public static async index(elasticIndex, id, body) {
    try {
      const response = await ElasticHelper.elasticClient.index({
        index: elasticIndex,
        type: '_doc',
        id,
        body
      });
      console.log('Added a document to Index', response);
    }
    catch (e) {
      console.log('error while inserting at index', e);
    }
  }

  public static async search(searchQuery: any) {
    const searchRes = await ElasticHelper.elasticClient.search(searchQuery)
    return searchRes
  }

  public static async msearch(searchQuery: any) {
    await ElasticHelper.elasticClient.putScript({
      id: 'querytemplate',
      body: {
        'script': {
          'lang': 'mustache',
          'source': {
            'size': 0,
            'query': {
              'bool': {
                'must': [
                  {
                    'term': {
                      'courseWorkId.keyword': {
                        'value': '{{courseWorkId}}'
                      }
                    }
                  },
                  {
                    'term': {
                      'responseData.x_tutorial.keyword': {
                        'value': 'false'
                      }
                    }
                  },
                  {
                    'term': {
                      'responseData.y_attempted': {
                        'value': 'true'
                      }
                    }
                  },
                  {
                    'bool': {
                      'should': [
                        {
                          'terms': {
                            'tags.keyword': [
                              '{{#skill}}',
                              '{{.}}',
                              '{{/skill}}'
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },
            'aggs': {
              'studentIds': {
                'terms': {
                  'field': 'userId.keyword',
                  'size': 10
                },
                'aggs': {
                  'averageAccuracy': {
                    'avg': {
                      'field': 'responseData.y_accuracy'
                    }
                  },
                  'totalScore': {
                    'sum': {
                      'field': 'responseData.y_trial_score'
                    }
                  },
                  'totalTimeSpent': {
                    'sum': {
                      'field': 'responseData.y_trial_time'
                    }
                  },
                  'problemsAnswered': {
                    'sum': {
                      'script': {
                        'source': 'doc['responseData.y_attempted'].value == true ? 1 : 0'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
    const searchRes = await ElasticHelper.elasticClient.msearchTemplate(searchQuery)
    return searchRes
  }

  public static async isIndexExists(indexName) {
    const isIndexExists = await ElasticHelper.elasticClient.indices.exists({
      index: indexName
    })
    return isIndexExists;
  }

  public static async delete(elasticIndex, id) {
    try {
      const response = await ElasticHelper.elasticClient.delete({
        index: elasticIndex,
        type: elasticIndex,
        id
      });
      console.log(`Deleted a document from Index : ${elasticIndex}`, response);
    }
    catch (e) {
      console.log('error while deleting at index', e);
    }
  }

  public static async putAlias(indices, alias) {
    try {
      await ElasticHelper.elasticClient.indices.putAlias({
        index: indices,
        name: alias
      });
      console.log(`Created an alias : ${alias} for indices :`, indices);
    }
    catch (e) {
      console.log('error while creating an alias', e);
    }
  }

  public static async createIndex(index, body) {
    try {
      const response = await ElasticHelper.elasticClient.indices.create({
        index,
        body
      })
      console.log(`Created index : ${index}, mapping : ${body}, response :`, response);
    }
    catch (e) {
      console.log('error while creating mapping ', e);
    }
  }

  public static async searchWithIndex(index, body) {
    const searchRes = await ElasticHelper.elasticClient.search({
      index,
      body
    })
    return searchRes
  }
}
