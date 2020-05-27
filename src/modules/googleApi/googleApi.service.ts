import {HttpException, Injectable} from '@nestjs/common';
import {Credentials, OAuth2Client} from 'google-auth-library';
import {google} from 'googleapis';
import _ from 'lodash';
import fs from 'fs';
import util from 'util';

import credentialsJson from '../../../credentials.json';
import {IGoogleToken} from './googleToken.interface';

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const TOKEN_PATH = 'token.json';

export interface ICredential {
  installed: {
    client_id?: string;
    client_secret?: string;
    redirect_uris?: string[];
  };
}

@Injectable()
export class GoogleApiService {
  private oAuth2Client: OAuth2Client;

  private SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

  constructor() {
    (async (): Promise<void> => {
      try {
        await this.authorize();
      } catch (err) {
        console.error(err);
      }
    })();
  }

  async getClient(): Promise<OAuth2Client> {
    if (!this.oAuth2Client) {
      return await this.authorize();
    }

    return this.oAuth2Client;
  }

  async authorize(): Promise<OAuth2Client> {
    try {
      await readFileAsync(TOKEN_PATH);
    } catch (err) {
      throw new HttpException(
        {
          message:
            'Google Api: please authorize this app, by visiting /authorize',
        },
        401,
      );
    }

    // Load client secrets from a local file.
    const credentials: ICredential = credentialsJson;

    const {client_secret, client_id, redirect_uris} = credentials.installed;

    this.oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );

    const tokenBuffer: any = await readFileAsync(TOKEN_PATH);

    const tokens = JSON.parse(tokenBuffer) as IGoogleToken;

    const token: Credentials = {
      ...tokens,
      expiry_date: Number(tokens.expiry_date),
    };

    this.oAuth2Client.setCredentials(token);

    return this.oAuth2Client;
  }

  generateNewAuthUrl(): {message: string; link: string} {
    if (_.isEmpty(this.oAuth2Client?.credentials)) {
      const authUrl = this.oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: this.SCOPES,
      });

      return {
        message: `${authUrl}`,
        link: authUrl,
      };
    } else {
      throw new HttpException('Already authorized', 400);
    }
  }

  async setNewToken(code: string): Promise<void> {
    try {
      const {tokens} = await this.oAuth2Client.getToken(code);

      this.oAuth2Client.setCredentials(tokens);

      const token: IGoogleToken = {
        ...tokens,
        expiry_date: tokens.expiry_date.toString(),
      };

      await writeFileAsync(TOKEN_PATH, JSON.stringify(token));
    } catch (err) {
      console.error(err);

      if (err.message === 'invalid_grant') {
        throw new HttpException(err.message, 400);
      }

      throw err;
    }
  }
}
