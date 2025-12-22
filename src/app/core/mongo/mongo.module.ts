import { Module, ModuleWithServices } from '@rxdi/core';
import { connect, ConnectOptions, set } from 'mongoose';

import { UserModel } from './models';
import { CONNECTION_TOKEN, DatabaseModels } from './mongodb.injection.tokens';

@Module()
export class MongoDbModule {
  public static forRoot(url: string, config?: ConnectOptions): ModuleWithServices {
    return {
      module: MongoDbModule,
      services: [
        {
          provide: CONNECTION_TOKEN,
          lazy: true,
          useFactory: async () => {
            set('strictQuery', true);
            set('useFindAndModify', true);
            set('useUnifiedTopology', true);
            set('useNewUrlParser', true);
            await connect(url, config);
            return true;
          },
        },
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
