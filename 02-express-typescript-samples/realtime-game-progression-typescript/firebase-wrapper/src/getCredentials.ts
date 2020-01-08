import { DocumentInterfaces } from './identifiers';

export default function getCredentials(): DocumentInterfaces.ICredentials {
  const credentialsKey = 'credentials';
  let _credentials: DocumentInterfaces.ICredentials | null;
  _credentials = JSON.parse(localStorage.getItem(credentialsKey));
  return _credentials;
}
