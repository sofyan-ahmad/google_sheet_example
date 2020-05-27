import {Controller, Get} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';

import {GoogleSheetService} from './googleSheet.service';

@ApiBearerAuth()
@ApiTags('Sheet')
@Controller('sheet')
export class GoogleSheetController {
  constructor(private readonly service: GoogleSheetService) {}

  @Get()
  @ApiOperation({summary: 'Get Google Sheet'})
  async readSheet(): Promise<any[]> {
    return await this.service.readSheet();
  }
}
