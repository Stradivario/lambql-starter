import { MongoDbModule } from '@core/mongo';
import { CoreModule, Module } from '@gapi/core';
import { GraphQLCustomDirective } from '@gapi/core';
import { VoyagerModule } from '@gapi/voyager';
import { AltairModule } from '@rxdi/altair';
import { SharedModule } from '@shared/shared.module';
import { DirectiveLocation } from 'graphql';

import { ENVIRONMENT } from '~/environment';

import { AppInterceptors } from './app.interceptors';
import { UserModule } from './user/user.module';

export const ToUpperCaseDirective = new GraphQLCustomDirective<string>({
  name: 'toUpperCase',
  description: 'change the case of a string to uppercase',
  locations: [DirectiveLocation.FIELD],
  resolve: async (resolve) => {
    const value = await resolve();
    return value.toUpperCase();
  },
});

@Module({
  imports: [
    CoreModule.forRoot({
      graphql: {
        directives: [ToUpperCaseDirective],
        path: '/graphql',
      },
      server: {
        hapi: {
          port: ENVIRONMENT.PORT,
          routes: {
            cors: {
              origin: ['*'],
              additionalHeaders: [
                'Host',
                'User-Agent',
                'Accept',
                'Accept-Language',
                'Accept-Encoding',
                'Access-Control-Request-Method',
                'Access-Control-Allow-Origin',
                'Access-Control-Request-Headers',
                'Origin',
                'Connection',
                'Pragma',
                'Cache-Control',
              ],
            },
          },
        },
      },
    }),
    MongoDbModule.forRoot(ENVIRONMENT.MONGODB_URI),
    VoyagerModule.forRoot(),
    AltairModule.forRoot(),
    SharedModule,
    AppInterceptors.forRoot(),
    UserModule,
  ],
})
export class AppModule {}
