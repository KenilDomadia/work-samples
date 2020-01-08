import * as _ from "lodash";;
import { IQuestion } from "../Types";
import { QuestionResults } from "../";
import generateTopicQuestions from "./generateTopicQuestions";
export { default as generateTopicQuestions } from "./generateTopicQuestions";

const topics: ITopic[] = require("../fixtures/topics.json");

interface ITopic {
  topicId: string;
  topicName: string;
  difficulty: number;
  input: any;
  displayOrder: number;
}
interface ITopicState {
  topicId: string;
  isEnabled: boolean;
  fluentQuestions: number;
  totalQuestions: number | null;
  displayOrder: number;
}

interface ITopicInitParams {
  studentGrade: number;
  topicState: ITopicState[];
}

enum ProductNames {
  FlashFlow = "Flash Flow",
  FactFlow = "Fact Flow"
}

export default class Topics {

  private studentContentKey = "";
  private lastServedTopicInfo = {
    id: "",
    fluentQuestions: 0
  };

  constructor(private initParams: ITopicInitParams) {
    this.init();
  }

  private init(): void {
    this.studentContentKey = `${ProductNames.FactFlow}`;
    // this.studentContentKey = `${ProductNames.FlashFlow}.Grade ${this.initParams.studentGrade}`;
    // generate topic state
    topics
      .filter(topic => topic.topicId.startsWith(this.studentContentKey))
      .forEach(topicData => {
        const { topicId, displayOrder } = topicData;
        const index = _.findIndex(this.initParams.topicState, { topicId });
        if (index === -1) {
          const topicState: ITopicState = {
            topicId,
            displayOrder,
            isEnabled: true,
            fluentQuestions: 0,
            totalQuestions: null
          };
          this.initParams.topicState.push(topicState);
        }
      });
  }

  public getTopics(): any {
    const allTopics: any[] = [];

    // generate all topic names using topic progress
    // const allEnabledTopicState = this.initParams.topicState
    //   .filter(topicState => topicState.isEnabled === true);

    this.initParams.topicState.forEach(topicState => {
      const filteredTopicId = topicState.topicId.replace(this.studentContentKey + ".", "")
        .split(".");
      const obj = { name: filteredTopicId[1], topicState };
      const index = _.findIndex(allTopics, { name: filteredTopicId[0] });

      if (index !== -1) {
        allTopics[index].topics.push(obj);
      } else {
        allTopics.push({ name: filteredTopicId[0], topics: [obj] });
      }
    });

    allTopics.forEach((obj, index) => {
      allTopics[index].topics = _.orderBy(obj.topics, ["topicState.displayOrder"]);
    });

    return allTopics;
  }

  public getQuestions(topicId: string): IQuestion[] {
    const topicStateIndex = _.findIndex(this.initParams.topicState, { topicId });
    const topicIndex = _.findIndex(topics, { topicId });
    if (topicIndex !== -1 && topicStateIndex !== -1) {
      this.lastServedTopicInfo = {
        id: topicId,
        fluentQuestions: 0
      };
      const output = generateTopicQuestions(topics[topicIndex].input);
      this.initParams.topicState[topicStateIndex].totalQuestions = output.length;
      return _.shuffle(output);
    } else {
      throw new Error(`Provided topic id not found: ${topicId}`);
    }
  }

  public saveQuestionResult(questionResult: QuestionResults, question?: IQuestion): void {
    const topicStateIndex = _.findIndex(this.initParams.topicState, { topicId: this.lastServedTopicInfo.id });

    if (topicStateIndex !== -1) {
      if (questionResult === QuestionResults.FLUENT) {
        this.lastServedTopicInfo.fluentQuestions++;
      }

      if (this.lastServedTopicInfo.fluentQuestions >
        this.initParams.topicState[topicStateIndex].totalQuestions!) {
        throw new Error(`Fluent questions for current topic exceeded totalQuestions`);
      }

      if (this.lastServedTopicInfo.fluentQuestions >
        this.initParams.topicState[topicStateIndex].fluentQuestions) {
        this.initParams.topicState[topicStateIndex].fluentQuestions = this.lastServedTopicInfo.fluentQuestions;
      }

    } else {
      throw new Error(`Last served topic id not found: ${this.lastServedTopicInfo} ${question}`);
    }
  }

  public getTopicDifficulty(topicName: string): number {
    const topicObj = _.find(topics, topic => topic.topicName === topicName);
    if (topicObj) {
      return topicObj.difficulty;
    } else {
      throw new Error(`Topic not found in JSON : ${topicName}`);
    }
  }

  public getTopicState(): ITopicState[] {
    return this.initParams.topicState;
  }

  /**
   * Update enablility of topics
   * @memberof TopicSection
   */
  public updateTopics(updateObjs: { topicId: string, isEnabled: boolean }[]): void {
    updateObjs.forEach(({ topicId, isEnabled }) => {
      const topicStateIndex = _.findIndex(this.initParams.topicState, { topicId });
      if (topicStateIndex !== -1) {
        this.initParams.topicState[topicStateIndex].isEnabled = isEnabled;
      } else {
        throw new Error(`Provided topic id not found: ${topicId}`);
      }
    });
  }

  public updateStudentGrade(grade: number): void {
    this.initParams.studentGrade = grade;
    this.init();
  }
}
