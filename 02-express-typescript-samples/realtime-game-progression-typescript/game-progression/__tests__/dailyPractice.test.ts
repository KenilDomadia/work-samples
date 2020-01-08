import initProgression, { Progression } from "../TestHelpers/init";
test("basic", async () => {

    const response = simulateAnswers([
        "80c", "2i", "4c", "5i", "10c", "3i", "400c"
    ]);
    expect(response).toBeDefined();
});

function simulateAnswers(inputs: any[]): void {
    let progression: Progression = initProgression({});
    const question = progression.getNextQuestion();
    let prevQuestion = question;

    logQuestion(question);

    inputs.forEach((input) => {
        if (input.length >= 2) {
            const responseType = input[input.length - 1];
            const noOfTimes = input.slice(0, -1);
            const questionResult: any = (responseType === "c") ? "FLUENT" : "SLOW";
            for (let i = 0; i < noOfTimes; i++) {
                progression.saveQuestionResult(prevQuestion.questionId, questionResult);
                const question = progression.getNextQuestion();
                logQuestion(question);
                prevQuestion = question;
            }
        } else {
            progression = initProgression(progression.getProgressionState());
            const question = progression.getNextQuestion();
            prevQuestion = question;
            logQuestion(question);
        }
    });
    console.log("threshold: ", progression.getProgressionState().difficultyThreshold);
    console.log(JSON.stringify(progression.getProgressionState().topicMastery, undefined, 2));
    return 1;
}

function logQuestion(question): void {
    console.log(question.questionId, question.topics[1], question.difficulty);
}
