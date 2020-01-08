export interface IQuestion {
    answers: string[];
    difficulty: number;
    topics: string[];
    reserveCounter?: number;
    grades: string[];
    questionId: string;
    distractors: string[];
}

export interface IAttemptedQuestion {
    questionId: string;
    attemptCount: number;
    lastQuestionResult: QuestionResults;
}
export interface IAttemptedQuestions {
    [questionId: string]: IAttemptedQuestion;
}

export type IBucketState = {
    [key in LeitnerBuckets]: {
        [questionId: string]: {
            questionId: string
        }
    };
};

export enum LeitnerBuckets {
    EVERYDAY = "EVERYDAY",
    TTH = "TTH",
    FRI = "FRI"
}

export type IBucketFrequencyCount = {
    [key in LeitnerBuckets]: number;
};

export interface ITopicMasteryVM {
    topicName: string;
    masteredQuestionsCount: number;
    isTopicMastered: boolean;
}

export enum QuestionResults {
    SLOW = "SLOW",
    SKIP = "SKIP",
    INCORRECT = "INCORRECT",
    FLUENT = "FLUENT",
    TIME_UP = "TIME_UP",
    EXIT = "EXIT"
}

export enum Operations {
    ADDITION = "+",
    SUBTRACTION = "-",
    MULTIPLICATION = "*",
    DIVISION = "/"
}
