import * as fs from 'fs';
import { Credentials } from 'google-auth-library';
import { google } from 'googleapis';

export default class GCHelper {
    constructor() {
        this.initoauth2Client();
    }


    private oauth2Client: any;
    private SCOPES = [
        'https://www.googleapis.com/auth/classroom.courses',
        'https://www.googleapis.com/auth/classroom.rosters',
        'https://www.googleapis.com/auth/classroom.coursework.students',
        'https://www.googleapis.com/auth/classroom.coursework.me',
        'https://www.googleapis.com/auth/classroom.profile.emails',
        'profile',
        'email'
    ];

    private initoauth2Client() {
        const content = fs.readFileSync('credentials.json', { encoding: 'utf8' });

        const credentials = JSON.parse(content);
        const { client_secret, client_id } = credentials.web;
        // const isProd = (process.env.NODE_ENV === 'production') ? 1 : 0
        console.log('environment : ', process.env.NODE_ENV);
        this.oauth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            'postmessage'
        );
    }

    public generateAuthUrl() {
        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES
        });
        return authUrl;
    }

    public async getToken(code: string): Promise<{ tokens: Credentials, payload: any }> {
        // This will provide an object with the access_token and refresh_token.
        // Save these somewhere safe so they can be used at a later time.
        try {
            console.log('getting token..');
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);

            console.log('verifying token..');
            const data = await this.oauth2Client.verifyIdToken({
                idToken: tokens.id_token
            } as any);
            return { tokens, payload: data.getPayload() };
        } catch (e) {
            console.log('Error while getting access token. ', e.message);
            throw new Error(`Invalid code for getting access token or oauth2client not initialised properly ${e}`);
        }
    }
}