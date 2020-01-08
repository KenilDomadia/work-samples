import initProgression, { Progression } from "../TestHelpers/init";

test("basic", async () => {
  let progression: Progression = initProgression({});
  const questions = progression.getWeeklyQuizQuestions();
  questions.forEach(({ questionId }) => {
    const distractors = progression.generateDistractors(questionId);
    console.log(questionId, distractors);
  });
  expect(questions.length).toEqual(50);
});
