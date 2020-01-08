const fs = require('fs');
// const SCOPES = [
//   'https://www.googleapis.com/auth/classroom.courses.readonly',
//   'https://www.googleapis.com/auth/classroom.rosters.readonly',
//   'https://www.googleapis.com/auth/classroom.profile.emails'
// ];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// const TOKEN_PATH = 'token.json';
const { google } = require('googleapis');

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
export async function authorize(
  classroomToken: string,
  forceNewToken?: boolean
  // access_token?: string
): Promise<{}> {
  return new Promise(resolve => {
    fs.readFile('credentials.json', async (err, content) => {
      if (err) {
        console.error('Error loading client secret file:', err);
        return;
      }
      // Authorize a client with credentials, then call the Google Classroom API.
      const credentials = JSON.parse(content);
      const { client_secret, client_id, redirect_uris } = credentials.web;
      let oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );
      console.log('generating new token');
      oAuth2Client = await getNewToken(oAuth2Client, classroomToken);
      resolve(oAuth2Client);
    });
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
async function getNewToken(oAuth2Client, classroomToken): Promise<{}> {
  // const authUrl = oAuth2Client.generateAuthUrl({
  //   access_type: 'offline',
  //   scope: SCOPES
  // });
  // console.log('Authorize this app by visiting this url:', authUrl);
  return new Promise(resolve => {
    // const code = classroomToken;
    // console.log(classroomToken);
    // oAuth2Client.getToken(code, (err, token) => {
    //   if (err) {
    //     console.error('Error retrieving access token', err);
    //     return;
    //   }
    //   console.log('generated token ', token);

    const token = {
      access_token: classroomToken
    };

    oAuth2Client.setCredentials(token);
    resolve(oAuth2Client);
  });
}
