import {Module} from '@nestjs/common';

import {GoogleApiController} from './googleApi.controller';
import {GoogleApiService} from './googleApi.service';

@Module({
  controllers: [GoogleApiController],
  providers: [GoogleApiService],
  exports: [GoogleApiService],
})
export class GoogleApiModule {}
