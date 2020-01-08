import { IQuestion } from "../Types";
import * as _ from "lodash";
import generateDistractors from "../generateDistractors";
const seedrandom = require("seedrandom");
export const map = new Map<string, any>();
const prng = seedrandom("factflow");

export default function generateTopicQuestions(input: any): IQuestion[] {
    let result: any[] = [];
    let count = input.metadata.repeat
        ? parseInt(input.metadata.repeat, 10)
        : 1;
    while (count > 0) {
        const ques = _.cloneDeep(input);
        let condition = input.metadata.condition
            ? input.metadata.condition.slice()
            : "true";
        // resolve all the variables and store their values in the map
        Object.keys(ques.metadata).forEach(variable => {
            if (!map.has(variable)) {
                const value = resolveVariable(variable, ques.metadata);
                map.set(variable, value);
            }
        });
        // replace all the variables in question.attributes values
        Object.keys(ques.attributes)
            .filter(key => typeof ques.attributes[key] === "string")
            .forEach(key => {
                const vars = ques.attributes[key].match(/\${(.|[^\{\}]+)}/g);
                if (vars) {
                    vars.forEach((variable: string) => {
                        ques.attributes[key] = ques.attributes[key].replace(variable, map.get(variable));
                    });
                }
            });
        // replace the variables in the condition and evaluate
        const vars = condition.match(/\${(.|[^\{\}]+)}/g);
        if (vars) {
            vars.forEach((variable: string) => {
                return (condition = condition.replace(variable, map.get(variable)));
            });
        }
        // clear the map once all variables are replaced with their values
        const allowDuplicates = ques.metadata.allowDuplicates;
        delete ques.metadata;
        map.clear();
        // if the condition evaluates to true, only then do we add question to the result
        if (
            // tslint:disable-next-line: no-eval
            eval(condition) &&
            !(!allowDuplicates && result.some(ele => _.isEqual(ele, ques)))) {
            count = count - 1;
            result.push(ques);
        }
    }

    const output = extractFieldsFromOutput(result);
    return output;
}

function extractFieldsFromOutput(output: any[]): any[] {
    const questionsCsv: any = [];
    const questions = output.map((question: any) => {
        // generate grade and topics field of output csv using question props
        const grades = question.tags
            .filter((tag: string) => tag.indexOf("grade:") !== -1)
            .map((tagString: string) => tagString.split(":")[1])
            .map((tagString: string) => tagString.split("grade")[1]);
        const topics = question.tags
            .filter((tag: string) => tag.indexOf("topic:") !== -1)
            .map((tagString: string) => tagString.split(":")[1]);
        const difficulty = question.tags
            .filter((tag: string) => tag.indexOf("difficulty:") !== -1)
            .map((tagString: string) => tagString.split(":")[1].trim())[0];

        let answers: any[] = question.attributes.answer ? [question.attributes.answer] :
            generateAnswers(question.attributes.question);

        let distractors: any[] = question.attributes.distractors ? question.attributes.distractors :
            generateDistractors(question.attributes.question).map(distractor => distractor.toString());

        return {
            questionId: question.attributes.question,
            answers,
            topics,
            grades,
            difficulty: parseInt(difficulty, undefined),
            distractors
        };
    });

    questionsCsv.push(...questions);

    return questionsCsv;
}

export function generateAnswers(questionId: string): string[] {
    let answers: string[] = [];
    try {
        // tslint:disable-next-line:no-eval
        answers = [eval(questionId).toString()];
    } catch (e) {
        // console.log(`could not eval questionId: ${questionId}`);
    }
    return answers;
}

function getRandomValueFromArray(arr: any[]): any {
    return arr[Math.floor(prng() * arr.length)];
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomNumber(min: number, max: number): any {
    return prng() * (max - min) + min;
}

function resolveRange(obj: any): any {
    const [start, end] = obj.value.split("-").map((str: string) => parseInt(str, 10));
    let range = _.range(start, end + 1);
    range = obj.exclude
        ? range.filter(element => !_.includes(obj.exclude, element))
        : range;
    range = obj.include ? range.concat(obj.include) : range;
    return getRandomValueFromArray(range);
}
function resolveOption(obj: any): any {
    let options = obj.value;
    options = obj.exclude
        ? options.filter((element: any) => !_.includes(obj.exclude, element))
        : options;
    options = obj.include ? options.concat(obj.include) : options;
    return getRandomValueFromArray(options);
}
function resolveExpression(obj: any, metadata: any): any {
    let variables = obj.value.match(/\${(.|[^\{\}]+)}/g);
    if (!variables) {
        return obj.value;
    }
    let map = new Map();
    variables.forEach((variable: any) => {
        const value = map.has(variable)
            ? map.get(variable)
            : resolveVariable(variable, metadata);
        map = map.has(variable) ? map : map.set(variable, value);
    });
    let expression = obj.value;
    variables.forEach((variable: any) => {
        if (map.has(variable)) {
            expression = expression.replace(variable, map.get(variable));
        } else {
            console.error(`variable ${variable} is unresolved`);
        }
    });
    return expression;
}
function resolveArray(obj: any, metadata: any): any {
    let array: any[] = [];
    const includes = obj.include ? obj.include.length : 0;
    if (obj.include) {
        obj.include.forEach((element: any) => {
            array.push(resolveVariable(element, metadata));
        });
    }
    const [start, end] = obj.noOfElements
        .split("-")
        .map((str: string) => parseInt(str, 10));
    const noOfElements = getRandomNumber(start, end - 1);
    for (let i = 0; i < noOfElements - includes; i++) {
        let value = resolveVariable(obj.value, metadata);
        while (_.includes(array, value)) {
            value = resolveVariable(obj.value, metadata);
        }
        array.push(value);
    }
    return _.shuffle(array);
}
function resolveEval(obj: any, metadata: any): any {
    // tslint:disable-next-line: no-eval
    return eval(resolveExpression(obj, metadata));
}
enum Type {
    RANGE = "Range",
    OPTION = "Option",
    ARRAY = "Array",
    EXPRESSION = "Expression",
    EVAL = "Eval"
}
function resolveVariable(variable: string, metadata: any, fromCache = true): any {
    if (!metadata[variable].type) {
        return variable;
    }
    if (fromCache && map.has(variable)) {
        return map.get(variable);
    }
    switch (metadata[variable].type) {
        case Type.RANGE:
            return resolveRange(metadata[variable]);
        case Type.OPTION:
            return resolveOption(metadata[variable]);
        case Type.EXPRESSION:
            return resolveExpression(metadata[variable], metadata);
        case Type.ARRAY:
            return resolveArray(metadata[variable], metadata);
        case Type.EVAL:
            return resolveEval(metadata[variable], metadata);
        default:
            throw new Error(`unsupported metadata type ${metadata[variable].type}`);
    }
}
