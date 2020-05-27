import {Module} from '@nestjs/common';

import {GoogleApiModule} from './modules/googleApi/googleApi.module';
import {GoogleSheetModule} from './modules/googleSheet/googleSheet.module';

export function moduleFactory(): any {
  @Module({
    imports: [GoogleApiModule, GoogleSheetModule],
  })
  class AppModule {}

  return AppModule;
}
