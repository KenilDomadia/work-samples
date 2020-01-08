import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces } from './identifiers';

export default async function addDomain({
  name,
  meta = '',
}: Partial<DocumentInterfaces.IDomainsDoc>) {
  try {
    const domainsRef = app.firestore.collection('domains');
    const domainDocs = await domainsRef.where('name', '==', name).get();
    if (domainDocs.empty) {
      const docRef = await domainsRef.add({
        name,
        meta
      });
      console.log('Document written with ID: ', docRef.id);
      return { id: docRef.id };
    } else {
      console.log('domainDocs :', domainDocs);
      const docRef = await domainsRef.doc(domainDocs.docs[0].id);
      await docRef.set({
        meta
      }, { merge: true });
      return { id: domainDocs.docs[0].id };
    }
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
