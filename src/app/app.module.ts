import { MongoDbModule } from '@core/mongo';
import { CoreModule, Module } from '@gapi/core';
import { GraphQLCustomDirective } from '@gapi/core';
import { VoyagerModule } from '@gapi/voyager';
import { SharedModule } from '@shared/shared.module';
import { DirectiveLocation } from 'graphql';

import { ENVIRONMENT, isDevelopment } from '~/environment';

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
        initQuery: true,
        openBrowser: false,
        writeEffects: false,
        graphiql: false,
        graphiQlPlayground: true,
        graphiQlPath: '/graphiql',
        graphiqlOptions: {
          endpointURL: '/graphql',
          subscriptionsEndpoint: `${process.env.GRAPHIQL_WS_SSH ? 'wss' : 'ws'}://${
            process.env.GRAPHIQL_WS_PATH || 'localhost'
          }:${process.env.API_PORT || process.env.PORT || 9000}/subscriptions`,
          websocketConnectionParams: {
            token: process.env.GRAPHIQL_TOKEN,
          },
        },
        graphqlOptions: {
          tracing: isDevelopment(),
          schema: null,
        },
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
    SharedModule,
    AppInterceptors.forRoot(),
    UserModule,
  ],
})
export class AppModule {}
