import {HttpException, Injectable} from '@nestjs/common';
import {google} from 'googleapis';

import {GoogleApiService} from '../googleApi/googleApi.service';

@Injectable()
export class GoogleSheetService {
  constructor(private readonly googleApiService: GoogleApiService) {}

  async readSheet(): Promise<any[]> {
    try {
      const sheets = google.sheets({
        version: 'v4',
        auth: await this.googleApiService.getClient(),
      });

      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.COGS_SHEET_ID,
        range: 'Class Data!A1:E',
      });

      const fields = res.data.values[0];

      res.data.values.splice(0, 1);

      const rows = res.data.values;

      if (rows.length) {
        const result = [];

        rows.map((row) => {
          const data = {};

          fields.map((field, index) => {
            data[field] = row[index];
          });

          result.push(data);
        });

        return result;
      } else {
        throw new HttpException('No data found.', 404);
      }
    } catch (err) {
      throw new HttpException('The API returned an error: ' + err, 500);
    }
  }
}
