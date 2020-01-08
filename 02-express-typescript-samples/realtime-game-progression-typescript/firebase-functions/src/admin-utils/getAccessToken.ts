import { getUsers } from '../../../utils/src';
import * as fs from 'fs';

export default async function getAccessToken(userId: string): Promise<any> {

    const usersDoc = await getUsers({ userId });
    console.log('Users Doc : ', usersDoc);
    const refresh_token = usersDoc[0].googleAuthRefreshToken;
    const content = fs.readFileSync('credentials.json', { encoding: 'utf8' });
    const credentials = JSON.parse(content);
    const { client_secret, client_id, token_uri } = credentials.web;
    const body = {
        client_id,
        client_secret,
        refresh_token,
        grant_type: 'refresh_token',
    };
    const url = token_uri
    const result = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body)
    });
    const data = await result.json()

    const { access_token } = data;

    if (!access_token) {
        throw new Error('Could not generate access token using given refresh token');
    } else {
        console.log('Access Token generated from Refresh Token : ', access_token);
        return access_token
    }


}
