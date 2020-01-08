import * as resposnseError from './common/responseError';
import { Types } from './identifiers';

export default async function parseMessageTemplateToString(
  template: Types.MessageTemplates,
  replaceString: string[]
): Promise<string> {
  try {
    let finalString = template.toString();
    if (template) {
      for (let i = 0; i < replaceString.length; i++) {
        finalString = finalString.replace(`$${i}`, replaceString[i]);
      }
      return finalString;
    } else {
      return '';
    }
  } catch (e) {
    throw new resposnseError.HttpsError(
      resposnseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
