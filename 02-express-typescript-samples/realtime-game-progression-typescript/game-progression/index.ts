import * as _ from 'lodash';
import {
  IQuestion,
  LeitnerBuckets,
  IAttemptedQuestion,
  IAttemptedQuestions,
  ITopicMasteryVM,
  IBucketFrequencyCount,
  IBucketState,
  QuestionResults
} from './Types';
import generateDistractors from './generateDistractors';
const topicThresholdData = require('./fixtures/topicThresholdData.json');
const questionBankJson: IQuestionBank = require('./fixtures/factFlow.json');

export { default as Topics } from './Topics';

export default class Progression {
  private bucketFrequencyCount: IBucketFrequencyCount = {
    EVERYDAY: 0,
    TTH: 0,
    FRI: 0
  };
  private questionsToServe: IQuestion[] = [];
  private excludingSuperTopicsList = [
    'addition',
    'subtraction',
    'multiplication',
    'division',
    'mixed'
  ];
  public static AssignmentTypes = AssignmentTypes;
  private questionBankExhausted = false;

  // List containing questions with incorrect response so that it can be reserved after 'defaultReserveFrequency'
  private questionsToReserve: {
    questionId: string;
    reserveCounter: number;
  }[] = [];

  private config: IProgressionConfig = {
    bucketFrequencyRatio: {
      EVERYDAY: 5,
      TTH: 3,
      FRI: 2
    },
    defaultReserveFrequency: 2,
    questionsPerBatch: 10,
    assignmentType: AssignmentTypes.ALL_OPERATIONS,
    questionBank: questionBankJson,
    weeklyQuizQuestionBank: questionBankJson,
    studentGrade: 5
  };
  private progressionState: IProgressionState;
  private questionsRespondedInThisBatch = 0;
  private fluentQuestionsInThisBatch = 0;
  public static generateDistractors = generateDistractors;
  public generateDistractors = generateDistractors;

  constructor(
    progressionStateParam: IProgressionStateParam,
    context: IContext
  ) {
    console.log(
      'PROGRESSION: Constructing progression. This log should appear once per user session until user logs out.'
    );

    // set default values of initConfig for optional fields
    const initialProgressionState: IProgressionState = {
      bucketState: { FRI: {}, TTH: {}, EVERYDAY: {} },
      attemptedQuestions: {},
      topicMastery: [],
      difficultyThreshold: 15
    };
    this.progressionState = Object.assign(
      initialProgressionState,
      progressionStateParam
    );

    // set context values
    this.config.assignmentType =
      context.assignmentType || this.config.assignmentType;
    this.config.studentGrade = context.studentGrade || this.config.studentGrade;

    // Note: this function is called from constructor because init function is called everytime session ends
    // whereas constructor is only called once and we want to filter question bank just once.
    this.filterQuestionBank();

    // set frequency count for buckets as per frequency ratio
    this.setBucketFrequencyCount();

    this.init();
  }

  /**
   * For daily practice - returns next question as per algorithm
   * @returns {(IQuestion)}
   * @memberof CustomLeitner
   */
  public getNextQuestion(): IQuestion {
    if (this.questionsToServe.length + this.questionsToReserve.length > 0) {
      // if questionsToServe is empty and questionsToReserve is non-empty,
      // serve next questions from questionsToReserve
      if (
        this.questionsToServe.length === 0 &&
        this.questionsToReserve.length > 0
      ) {
        const { questionId } = this.questionsToReserve.shift()!;
        const question = this.getQuestionUsingId(questionId);
        return question;
      } else {
        // reserve question, if reserveCounter of any question from questionsToReserve list is 0
        if (
          _.find(this.questionsToReserve, { reserveCounter: 0 }) &&
          this.questionsToReserve.length > 0
        ) {
          const questionId = this.questionsToReserve[0].questionId;
          this.questionsToReserve.shift();
          const question = this.getQuestionUsingId(questionId);
          return question;
        } else {
          // serve question from questionsToServe list
          const question = this.questionsToServe[0];
          this.questionsToServe.shift();
          return question;
        }
      }
    } else if (this.questionBankExhausted) {
      return this.getRandomQuestion();
    } else {
      // reinit with new batch as there's nothing to serve
      const batchFluency =
        this.fluentQuestionsInThisBatch / this.questionsRespondedInThisBatch;
      if (batchFluency > 0.9) {
        this.progressionState.difficultyThreshold += 5;
      } else if (batchFluency > 0.8) {
        this.progressionState.difficultyThreshold += 2.5;
      } else if (batchFluency <= 0.2) {
        this.progressionState.difficultyThreshold -= 5;
      }

      this.progressionState.difficultyThreshold = Math.min(
        this.progressionState.difficultyThreshold,
        100
      );
      this.progressionState.difficultyThreshold = Math.max(
        this.progressionState.difficultyThreshold,
        10
      );

      this.questionsRespondedInThisBatch = 0;
      this.fluentQuestionsInThisBatch = 0;
      this.init();
      return this.getNextQuestion();
    }
  }

  /**
   * For weekly quiz - Get random question from question bank
   * *IMPORTANT*: Do not call saveQuestionResult for responses given to the questions fetched from here.
   * @returns {IQuestion}
   * @memberof Progression
   */
  public getRandomQuestion(): IQuestion {
    const keys = Object.keys(this.config.questionBank);
    // tslint:disable-next-line:no-bitwise
    return this.config.questionBank[keys[(keys.length * Math.random()) << 0]];
  }

  /**
   * For review bin - get question using array of questionId from questionBank
   */
  public getQuestionUsingId(questionId: string): IQuestion {
    const question = questionBankJson[questionId];
    if (question) {
      return question;
    } else {
      throw new Error(
        `Question not found for provided id: ${questionId} in the array ${questionBankJson}`
      );
    }
  }

  /**
   * Feed question result to the algorithm
   * @param {IQuestion} question question returned from 'getNextQuestion' function call
   * @param {QuestionResults} [questionResult] question result
   * @memberof CustomLeitner
   */
  // based on result move previous attempted question to appropriate bucket
  public saveQuestionResult(
    questionId: string,
    questionResult: QuestionResults
  ): void {
    const attemptedQuestion = this.updateQuestionsAttempted(
      questionId,
      questionResult
    );
    let isFluent = questionResult === QuestionResults.FLUENT ? true : false;
    this.decreaseReserveCounter();

    let currentBucket: LeitnerBuckets;
    for (const bucketName in LeitnerBuckets) {
      if (
        questionId in
        this.progressionState.bucketState[bucketName as LeitnerBuckets]
      ) {
        currentBucket = bucketName as LeitnerBuckets;
        break;
      }
    }

    if (currentBucket!) {
      switch (currentBucket!) {
        case LeitnerBuckets.EVERYDAY:
          if (isFluent) {
            if (attemptedQuestion.attemptCount === 1) {
              delete this.progressionState.bucketState[currentBucket!][
                questionId
              ];
              this.progressionState.bucketState.FRI[questionId] = {
                questionId
              };
            } else {
              delete this.progressionState.bucketState[currentBucket!][
                questionId
              ];
              this.progressionState.bucketState.TTH[questionId] = {
                questionId
              };
            }
          } else {
            if (attemptedQuestion.attemptCount === 1) {
              this.questionsToReserve.push({
                questionId,
                reserveCounter: this.config.defaultReserveFrequency
              });
            } else {
              // do nothing, keep question in EVERYDAY bucket
            }
          }
          break;
        case LeitnerBuckets.TTH:
          if (isFluent) {
            this.progressionState.bucketState.FRI[questionId] = { questionId };
            delete this.progressionState.bucketState[currentBucket!][
              questionId
            ];
          } else {
            this.progressionState.bucketState.EVERYDAY[questionId] = {
              questionId
            };
            delete this.progressionState.bucketState[currentBucket!][
              questionId
            ];
          }
          break;
        case LeitnerBuckets.FRI:
          if (isFluent) {
            this.updateTopicMastery(questionId);
            this.removeQuestionsWithMasteredTopics();
            delete this.progressionState.bucketState[currentBucket!][
              questionId
            ];
          } else {
            this.progressionState.bucketState.TTH[questionId] = { questionId };
            delete this.progressionState.bucketState[currentBucket!][
              questionId
            ];
          }
          break;
        default:
          break;
      }
    } else {
      // throw new Error(`No bucket found for the questionId:
      // ${questionId} ${JSON.stringify(this.progressionState.bucketState, undefined, 2)}`);
    }
  }

  /**
   * Save the progression state return by this function to the database
   *
   * @returns {IProgressionState} Save this object to the database
   * @memberof Progression
   */
  public getProgressionState(): IProgressionState {
    return this.progressionState;
  }

  private removeQuestionsWithMasteredTopics(): void {
    this.progressionState.topicMastery.forEach(topicObject => {
      let currentTopicThresholdMetadata = _.find(topicThresholdData, {
        topicName: topicObject.topicName
      });
      let currentTopicThreshold = currentTopicThresholdMetadata
        ? currentTopicThresholdMetadata.fluencyThreshold
        : 5;
      if (currentTopicThreshold < topicObject.masteredQuestionsCount) {
        for (const bucketName in this.progressionState.bucketState) {
          for (const questionId in this.progressionState.bucketState[
            bucketName as LeitnerBuckets
          ]) {
            const question = this.getQuestionUsingId(questionId);
            const index = question.topics.findIndex(
              s => s === topicObject.topicName
            );
            if (index !== -1) {
              delete this.progressionState.bucketState[
                bucketName as LeitnerBuckets
              ][questionId];
            }
          }
        }
      }
    });
  }

  private init(): void {
    // create temporary list of questionIds from question bank which are never served before
    // length of list is equal to batch size
    const newQuestionIdsFromBank = this.pickNewQuestionIdsFromBank();

    // fill buckets with questions using temporary list of questionIds as per bucket ratio
    this.fillBuckets(newQuestionIdsFromBank);

    // load serving question list from Everyday, TTH and FRI bucket as per bucketFrequencyRatio
    this.populateQuestionToServeInThisBatch();
  }

  private filterQuestionBank(): void {
    // set assigmentType based on student's grade
    let assignmentType: AssignmentTypes;
    if (this.config.studentGrade < 3) {
      assignmentType = AssignmentTypes.ADD_SUB;
    } else {
      assignmentType = AssignmentTypes.ALL_OPERATIONS;
    }

    this.config.questionBank = _.pickBy(
      this.config.questionBank,
      (value: IQuestion) => {
        // filter question bank based on grade
        let isGradeEligible = false;
        if (value.grades.length > 1) {
          isGradeEligible =
            value.grades.indexOf(this.config.studentGrade.toString()) !== -1;
        } else {
          isGradeEligible = true;
        }

        // filter question bank based on assignment
        let isAssignmentEligible = false;
        switch (assignmentType) {
          case AssignmentTypes.ALL_OPERATIONS:
            isAssignmentEligible = true;
            break;
          case AssignmentTypes.MUL_DIV:
            isAssignmentEligible =
              value.topics.indexOf('multiplication') !== -1 ||
              value.topics.indexOf('division') !== -1;
            break;
          case AssignmentTypes.ADD_SUB:
            isAssignmentEligible =
              value.topics.indexOf('addition') !== -1 ||
              value.topics.indexOf('subtraction') !== -1;
            break;
          default:
            console.log(
              'unidentified assignment id : ',
              this.config.assignmentType
            );
        }

        // remove all L2J questions, all l2J questions has 1000 difficulty, which is greater than 100
        let isNonL2J = value.difficulty < 100;

        return isGradeEligible && isAssignmentEligible && isNonL2J;
      }
    );

    // filter weekly quiz question bank
    const grade = Math.min(this.config.studentGrade, 4);
    this.config.weeklyQuizQuestionBank = _.pickBy(
      this.config.weeklyQuizQuestionBank,
      (value: IQuestion) => {
        const isL2J = value.topics.includes(`L2J_G${grade}`);

        return isL2J;
      }
    );

    // TODO: Remove question from bucketState, attemptedQuestions not belonging to current assignment
  }

  private setBucketFrequencyCount(): void {
    const totalRatioSum =
      this.config.bucketFrequencyRatio.EVERYDAY +
      this.config.bucketFrequencyRatio.TTH +
      this.config.bucketFrequencyRatio.FRI;

    this.bucketFrequencyCount.EVERYDAY = Math.ceil(
      (this.config.questionsPerBatch *
        this.config.bucketFrequencyRatio.EVERYDAY) /
      totalRatioSum
    );

    this.bucketFrequencyCount.TTH = Math.ceil(
      (this.config.questionsPerBatch * this.config.bucketFrequencyRatio.TTH) /
      totalRatioSum
    );

    this.bucketFrequencyCount.FRI = Math.ceil(
      (this.config.questionsPerBatch * this.config.bucketFrequencyRatio.FRI) /
      totalRatioSum
    );
  }

  private pickNewQuestionIdsFromBank(): string[] {
    console.log(
      'this.progressionState.difficultyThreshold',
      this.progressionState.difficultyThreshold
    );
    const questionBankOrderedByDifficulty = _.sortBy(
      Object.values(this.config.questionBank),
      [
        'difficulty',
        o => {
          return _.reverse(btoa(o.questionId).split(')).join(');
        }
      ]
    );

    let newQuestionsFromBank: IQuestion[] = [];
    for (const {
      questionId,
      difficulty,
      topics
    } of questionBankOrderedByDifficulty) {
      if (newQuestionsFromBank.length < this.config.questionsPerBatch) {
        // select only those questions which are never picked from bank before
        // questions should not be present in attempted questions list
        // unattempted question are also present in EVERYDAY bucket, so also check there
        if (
          !(questionId in this.progressionState.attemptedQuestions) && // question is not attempted
          !(questionId in this.progressionState.bucketState.EVERYDAY) && // question is not in EVERYDAY bucket
          difficulty > this.progressionState.difficultyThreshold && // difficulty is above threshold
          (topics.length < 2 ||
            newQuestionsFromBank.filter(question => {
              return question.topics.indexOf(topics[1]) !== -1;
            }).length < 3) // no more than 3 question from same topic
        ) {
          const question = this.getQuestionUsingId(questionId);
          newQuestionsFromBank.push(question);
        }
      } else {
        break;
      }
    }

    // uncomment below lines to see console log when sufficient new questions are not picked from question bank
    // if (newQuestionsFromBank.length < this.config.questionsPerBatch) {
    // console.log(`Couldn't pick enough new questions from questionBank bucket for this batch...
    //             All questions are attemped at least once. Number of questions left : `,
    // newQuestionsFromBank.length);
    // }

    // newQuestionsFromBank = _.shuffle(newQuestionsFromBank);

    return newQuestionsFromBank.map(question => question.questionId);
  }

  private fillBuckets(questionIds: string[]): void {
    // if FRI, TTH OR EVERYDAY bucket doesn't contain sufficient items, fill required items to EVERYDAY bucket
    for (const bucketName in LeitnerBuckets) {
      const requiredQuestionsCount = this.bucketFrequencyCount[
        bucketName as LeitnerBuckets
      ];
      const currentQuestionsCount = Object.keys(
        this.progressionState.bucketState[bucketName as LeitnerBuckets]
      ).length;

      if (currentQuestionsCount < requiredQuestionsCount) {
        let questionCountToRefill =
          requiredQuestionsCount - currentQuestionsCount;
        for (let i = 0; i < questionCountToRefill; i++) {
          let questionId = questionIds.pop();
          if (questionId) {
            this.progressionState.bucketState.EVERYDAY[questionId] = {
              questionId
            };
          }
        }
      }
    }
  }

  private populateQuestionToServeInThisBatch(): void {
    this.questionsToServe = [];
    this.questionsToReserve = [];

    // questionsInBucket is separate variable which helps to populate questionsToServe list
    let questionsInBucket: {
      [key in LeitnerBuckets]: { questionId: string }[];
    } = { TTH: [], EVERYDAY: [], FRI: [] };
    for (const bucketName in this.progressionState.bucketState) {
      const questions = Object.values(
        this.progressionState.bucketState[bucketName as LeitnerBuckets]
      );
      questionsInBucket[bucketName as LeitnerBuckets] = questions;
    }

    // pick questions from bucket as per frequency ratio and populate questionsToServe list
    for (const bucketName in this.bucketFrequencyCount) {
      for (
        let i = 0;
        i < this.bucketFrequencyCount[bucketName as LeitnerBuckets];
        i++
      ) {
        if (questionsInBucket[bucketName as LeitnerBuckets].length > 0) {
          const { questionId } = questionsInBucket[
            bucketName as LeitnerBuckets
          ].shift()!;
          const question = this.getQuestionUsingId(questionId);
          this.questionsToServe.push(question);
        } else {
          // search for non-empty bucket, start with EVERYDAY bucket
          let nonEmptyBucket: LeitnerBuckets;
          if (questionsInBucket.EVERYDAY.length) {
            nonEmptyBucket = LeitnerBuckets.EVERYDAY;
          } else if (questionsInBucket.TTH.length) {
            nonEmptyBucket = LeitnerBuckets.TTH;
          } else if (questionsInBucket.FRI.length) {
            nonEmptyBucket = LeitnerBuckets.FRI;
          } else {
            // all buckets are empty
            break;
          }
          const { questionId } = questionsInBucket[nonEmptyBucket!].shift()!;
          const question = this.getQuestionUsingId(questionId);
          this.questionsToServe.push(question);
        }
      }
    }

    if (!this.questionsToServe.length) {
      this.questionBankExhausted = true;
      console.log(this.progressionState.bucketState);
      console.log(
        `PROGRESSION : All questions exhausted from question bank. getNextQuestion will return random question!`
      );
    }

    // sort servingQuestion list according to difficulty
    this.questionsToServe.sort((a, b) => a.difficulty - b.difficulty);
  }

  private decreaseReserveCounter(): void {
    this.questionsToReserve.forEach(questionVM => {
      questionVM.reserveCounter =
        questionVM.reserveCounter || this.config.defaultReserveFrequency;
      questionVM.reserveCounter = Math.max(questionVM.reserveCounter - 1, 0);
    });
  }

  // update topic mastery of question
  private updateTopicMastery(questionId: string): void {
    const question = this.getQuestionUsingId(questionId);
    question.topics.forEach(topicName => {
      let topicObj = _.find(this.progressionState.topicMastery, { topicName });
      let topicIndex = _.findIndex(this.progressionState.topicMastery, {
        topicName
      });
      if (!topicObj) {
        // only include sub-topics in topicMastery list
        if (
          !this.excludingSuperTopicsList.includes(topicName) &&
          !topicName.startsWith('L2J_')
        ) {
          let newTopic: ITopicMasteryVM = {
            topicName,
            masteredQuestionsCount: 1,
            isTopicMastered: false
          };
          this.progressionState.topicMastery.push(newTopic);
        }
      } else {
        topicObj.masteredQuestionsCount++;
        let currentTopicThresholdMetadata = _.find(topicThresholdData, {
          topicName: topicObj.topicName
        });
        let currentTopicThreshold = currentTopicThresholdMetadata
          ? currentTopicThresholdMetadata.fluencyThreshold
          : 5;
        if (topicObj.masteredQuestionsCount >= currentTopicThreshold) {
          topicObj.isTopicMastered = true;
        }
        this.progressionState.topicMastery.splice(topicIndex, 1, topicObj);
      }
    });
  }

  private updateQuestionsAttempted(
    questionId: string,
    questionResult: QuestionResults
  ): IAttemptedQuestion {
    // add question to questionAttempted, if doesn't exist in the list
    let isQuestionAttemptedOnce = _.has(
      this.progressionState.attemptedQuestions,
      questionId
    );
    let attemptedQuestion: IAttemptedQuestion;
    if (isQuestionAttemptedOnce) {
      attemptedQuestion = {
        questionId,
        attemptCount:
          this.progressionState.attemptedQuestions[questionId].attemptCount + 1,
        lastQuestionResult: questionResult
      };
      this.progressionState.attemptedQuestions[questionId] = attemptedQuestion;
    } else {
      attemptedQuestion = {
        questionId: questionId,
        attemptCount: 1,
        lastQuestionResult: questionResult
      };
      this.progressionState.attemptedQuestions[questionId] = attemptedQuestion;
    }

    // update other counters
    this.questionsRespondedInThisBatch++;
    if (questionResult === QuestionResults.FLUENT) {
      this.fluentQuestionsInThisBatch++;
    }

    return attemptedQuestion;
  }
}
