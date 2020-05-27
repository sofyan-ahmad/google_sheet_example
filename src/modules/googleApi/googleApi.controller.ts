import {Body, Controller, Get, Post, Render} from '@nestjs/common';

import {GoogleApiService} from './googleApi.service';

@Controller()
export class GoogleApiController {
  constructor(private readonly service: GoogleApiService) {}

  @Get('authorize')
  @Render('main')
  authorize(): {message: string; link: string; view: string} {
    return {...this.service.generateNewAuthUrl(), view: 'authorize'};
  }

  @Post('authorize')
  async setAuthorizationCode(@Body() body: {code: string}): Promise<string> {
    await this.service.setNewToken(body.code);

    return 'Google authorization code saved';
  }
}
