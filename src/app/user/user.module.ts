import { Module } from '@gapi/core';

import { UserService } from './user.service';
import { UserMutationsController } from './user-mutations.controller';
import { UserQueriesController } from './user-queries.controller';

@Module({
  controllers: [UserMutationsController, UserQueriesController],
  providers: [UserService],
})
export class UserModule {}
