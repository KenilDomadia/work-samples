import * as _ from "lodash";
const randomGen = require("seedrandom")("factflow2");


export default function generateDistractors(questionId: string): number[] {
  const execArray = /\D/.exec(questionId);
  if (execArray) {
    const operator = execArray[0];
    const operands = questionId
      .split(operator[0])
      .map(operand => parseInt(operand, undefined));
    const inputDistractorSets = [[1], [2, -1], [3, -2]];
    try {
      const answer = eval(questionId);

      const distractors: number[] = [];

      const [operand1, operand2] = operands;
      inputDistractorSets.forEach(inputDistractorSet => {
        const inputDistractor = inputDistractorSet[Math.floor(randomGen() * inputDistractorSet.length)];
        const evalStr = `${operand1}${operator}(${operand2 + <any>inputDistractor})`;
        try {
          const distractor = Math.floor(
            eval(evalStr)
          );
          if (answer !== distractor) {
            distractors.push(distractor);
          }
        } catch (e) {
          throw new Error(`Cannot eval string : ${evalStr}`);
        }
      });

      let filteredDistractors = _.uniq(distractors)
        .filter(isFinite);// remove all NaN and Infinity values

      if (filteredDistractors.length < inputDistractorSets.length) {
        const staticValues: number[] = [-2, -1, 2, 0, 1];
        while (inputDistractorSets.length !== filteredDistractors.length) {
          const staticValue = staticValues.pop();
          if (answer !== staticValue) {
            filteredDistractors.push(staticValue as number);
            filteredDistractors = _.uniq(filteredDistractors);
          }
        }
      }
      return filteredDistractors;
    } catch (e) {
      return [];
    }
  } else {
    throw new Error(`Cannot find operator in questionId : ${questionId}`);
  }
}
