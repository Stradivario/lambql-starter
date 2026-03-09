import { Module, ModuleWithServices } from '@rxdi/core';

import { UserModel } from './models';
import { DatabaseModels } from './mongodb.injection.tokens';

@Module()
export class MongoDbModule {
  public static forRoot(): ModuleWithServices {
    return {
      module: MongoDbModule,
      services: [
        {
          provide: DatabaseModels,
          useFactory: () => ({
            user: UserModel,
          }),
        },
      ],
    };
  }
}
