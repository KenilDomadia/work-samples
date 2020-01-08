import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export interface IFirebaseAppOptions {
    apiKey: string;
}

export class FirebaseApp {
    private _app: firebase.app.App;
    public firestore: firebase.firestore.Firestore;
    public firestoreFieldValue: any;
    public auth: firebase.auth.Auth;
    public authGoogleAuthProvider: any;
    public authFacebookAuthProvider: any;
    public authRecaptchaVerifier: any;
    public options: IFirebaseAppOptions;
    public initializeApp(fireApp: any, firebaseNS?: any, authGoogleAuthProvider?: any, authFacebookAuthProvider?: any) {
        this._app = fireApp;
        this.firestoreFieldValue = fireApp.firestore.FieldValue || firebaseNS.firestore.FieldValue;
        this.authGoogleAuthProvider = authGoogleAuthProvider;
        this.authFacebookAuthProvider = firebaseNS ? firebaseNS.auth.FacebookAuthProvider: undefined;
        this.authRecaptchaVerifier = firebaseNS ? firebaseNS.auth.RecaptchaVerifier : undefined;
        this.firestore = this._app.firestore();
        this.auth = this._app.auth();
        this.options = this._app.options as IFirebaseAppOptions;
    }
}

let _app: FirebaseApp;
if (!_app) {
    console.log('ppl-mathfluency-utils: initing...');
}
_app = _app || new FirebaseApp();
export let app = _app;

export { Types } from './identifiers/Types';
