export { default as Progression } from "../";
import Progression, { IProgressionStateParam, } from "../";
export default function init(progressionStateParam: IProgressionStateParam): Progression {
    const progression = new Progression({}, {
        studentGrade: 5
    });
    return progression;
}
