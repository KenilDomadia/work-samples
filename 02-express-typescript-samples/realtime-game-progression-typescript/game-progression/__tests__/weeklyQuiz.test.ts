import initProgression, { Progression } from "../TestHelpers/init";

test("basic", async () => {

    let progression: Progression = initProgression({});
    const questions = progression.getWeeklyQuizQuestions();
    console.log(questions);
    console.log(questions.length);
    const questions2 = progression.getWeeklyQuizQuestions();
    console.log(questions2);
    console.log(questions2.length);
    expect(questions.length).toEqual(50);
    expect(questions2.length).toEqual(50);
});
