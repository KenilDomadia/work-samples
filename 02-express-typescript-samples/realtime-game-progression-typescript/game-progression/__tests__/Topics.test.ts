import Topic from "../Topics";
import { QuestionResults, Topics } from "..";

test("basic", async () => {
    const topicSection = new Topic({
        studentGrade: 2,
        topicState: []
    });

    const topics = topicSection.getTopics();
    console.log(JSON.stringify(topics, undefined, 2));

    topicSection.getQuestions("Fact Flow.Addition.Plus 2 Facts");
    topicSection.saveQuestionResult(QuestionResults.FLUENT);
    topicSection.saveQuestionResult(QuestionResults.SLOW);
    topicSection.saveQuestionResult(QuestionResults.FLUENT);
    topicSection.saveQuestionResult(QuestionResults.FLUENT);
    topicSection.saveQuestionResult(QuestionResults.FLUENT);

    const questions = topicSection.getQuestions("Fact Flow.Addition.Plus 10 Facts");
    console.log(questions);
    topicSection.saveQuestionResult(QuestionResults.FLUENT);

    topicSection.getQuestions("Fact Flow.Addition.Plus 10 Facts");
    topicSection.saveQuestionResult(QuestionResults.FLUENT);
    topicSection.saveQuestionResult(QuestionResults.FLUENT);

    // topicSection.updateStudentGrade(2);

    topicSection.updateTopics([{
        topicId: "Fact Flow.Addition.Plus 1 Facts",
        isEnabled: false
    }]);

    topicSection.updateStudentGrade(4);

    console.log("progress: ", topicSection.getTopics());
    console.log("question: ", topicSection.getQuestions("Fact Flow.Addition.Plus 1 Facts"));
});
