import * as admin from 'firebase-admin';
import * as adminUtils from '../admin-utils';
import * as utils from '../../../utils/src';
import * as fs from 'fs';

// Have the Admin SDK themselves fetch a service account on your behalf
const serviceAccount = fs.readFileSync('service_account.json', { encoding: 'utf8' });
const credentials = JSON.parse(serviceAccount);
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});
// initialize ppl-mathfluency-utils app
adminUtils.admin.initializeApp(admin);
utils.app.initializeApp(admin);

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
