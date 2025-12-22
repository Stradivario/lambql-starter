import { Module } from '@gapi/core';

import { StringService } from './services';

@Module({
  providers: [StringService],
})
export class SharedModule {}
