import * as functions from 'firebase-functions';
import * as fs from 'fs';
import * as path from 'path';

import wrapWithMiddleware from './common/middleware';

/**
 * Wraps the functions logic with firebase function.https.onRequest function.
 * Applies all middleware like CORS, authentication before wrapping
 * @param {Function} functionLogic
 * @returns
 */
function wrapWithFirebaseHttpsMiddlewareFunction(functionLogic: Function) {
    return functions.https.onRequest(async (req, res) => {
        await wrapWithMiddleware(req, res, functionLogic);
        return;
    });
}

function exportPlatformFunctionsFolder(folderName: string) {
    fs.readdirSync(path.resolve(__dirname, folderName)).forEach(dirName => {
        // get all directories inside firebase functions folder
        const functionLogic = require(`./${folderName}/${dirName}`).default;
        exports[dirName] = wrapWithFirebaseHttpsMiddlewareFunction(functionLogic);
    });
}

function exportEventFunctionsFolder(folderName: string) {
    fs.readdirSync(path.resolve(__dirname, folderName)).forEach(dirName => {
        // get all directories inside firebase functions folder
        exports[dirName] = require(`./${folderName}/${dirName}`).default;
    });
}

function wrapWithFirebaseHttpsFunction(functionLogic: Function) {
    return functions.https.onRequest(async (req, res) => {
        return await functionLogic(req, res);
    });
}
// function exportCMSFunctionsFolder(folderName: string) {
//     fs.readdirSync(path.resolve(__dirname, folderName)).forEach(dirName => {
//         const functionLogic = require(`./${folderName}/${dirName}`).default;
//         exports[dirName] = wrapWithFirebaseHttpsFunction(functionLogic);
//     });
// }

function exportPubSubFunctionsFolder(folderName: string) {
    fs.readdirSync(path.resolve(__dirname, folderName)).forEach(dirName => {
        exports[dirName] = require(`./${folderName}/${dirName}`).default;
    });
}

exportPlatformFunctionsFolder('platformFunctions');
exportEventFunctionsFolder('eventFunctions');
// exportCMSFunctionsFolder('cmsFunctions');
exportPubSubFunctionsFolder('pubsubFunctions');
