import { app } from './app';
import * as responseError from './common/responseError';
import { DocumentInterfaces } from './identifiers';

export default async function getDomains({
  name
}: Partial<DocumentInterfaces.IDomainsDoc>): Promise<DocumentInterfaces.IDomainsDoc[]> {
  try {
    let domainsRef = await app.firestore.collection('domains') as firebase.firestore.Query;
    if (name) {
      domainsRef = domainsRef.where('name', '==', name);
    }
    const domainDocs = await domainsRef.get();
    if (domainDocs.empty) {
      console.log(`Cannot find domain with name : ${name}`);
      return [];
    } else {
      const results = domainDocs.docs.map(domainDoc => {
        return { id: domainDoc.id, ...domainDoc.data() } as DocumentInterfaces.IDomainsDoc;
      });
      return results;
    }
  } catch (e) {
    throw new responseError.HttpsError(
      responseError.FunctionsErrorCode.invalid_argument,
      e.message
    );
  }
}
