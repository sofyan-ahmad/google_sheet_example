import {Module} from '@nestjs/common';

import {GoogleApiModule} from '../googleApi/googleApi.module';
import {GoogleSheetController} from './googleSheet.controller';
import {GoogleSheetService} from './googleSheet.service';
import {GoogleApiService} from '../googleApi/googleApi.service';

@Module({
  controllers: [GoogleSheetController],
  providers: [GoogleSheetService, GoogleApiService],
  imports: [GoogleApiModule],
})
export class GoogleSheetModule {}
