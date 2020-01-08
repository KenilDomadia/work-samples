import * as firebaseAdmin from 'firebase-admin';

export class firebaseAdminApp {
    private _app: firebaseAdmin.app.App;
    public firestore: firebaseAdmin.firestore.Firestore;
    public auth: firebaseAdmin.auth.Auth;
    public initializeApp(app: any) {
        this._app = app;
        this.firestore = this._app.firestore();
        this.auth = this._app.auth();
    }
};

let _admin: firebaseAdminApp;
if (!_admin) {
    console.log('ppl-mathfluency-utils: initing...');
}
_admin = _admin || new firebaseAdminApp();
export let admin = _admin;

export { default as addStudentsToCourse } from './addStudentsToCourse';
export { default as ElasticHelper } from './elasticHelper';
export { default as sendEmail } from './sendEmail';
export { default as mailTeacherWithStudentDetails } from './mailTeacherWithStudentDetails';
export { generateCsv } from './generateCsv';
export { default as updateAuthUser } from './updateAuthUser';
export { default as getAccessToken } from './getAccessToken';
export { default as updateUserPassword } from './updateUserPassword';
export { default as removeStudents } from './removeStudents';

export { default as addDistrict } from './addDistrict';
export { default as updateDistrict } from './updateDistrict';
export { default as removeChild } from './removeChild';

export { DocumentInterfaces } from './identifiers';
export { Types } from './identifiers';
