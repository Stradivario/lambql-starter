import { CONNECTION_TOKEN } from '@core/mongo';
import {
  Bootstrap,
  Container,
  GenericGapiResolversType,
  HAPI_SERVER,
  ON_REQUEST_HANDLER,
  RESOLVER_HOOK,
  ServiceArguments,
} from '@gapi/core';
import { Request, Server, ServerInjectOptions } from 'hapi';
import { connect } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { format } from 'url';

import { AppModule } from './app/app.module';
import { LambdaContext } from './context';

// const Main = lastValueFrom(
//   Bootstrap(AppModule).pipe(
//     tap(() => {
//       console.log('[Bootstrap]: Started');
//     })
//   )
// );

let container: Container;
// Bootstrap the application
const BootstrapApp = async (providers: ServiceArguments[]) => {
  if (container) {
    return;
  }
  container = await lastValueFrom(
    Bootstrap(AppModule.forRoot(providers)).pipe(
      tap(() => {
        console.log('[Blog API Bootstrap]: Application started successfully.');
      })
    )
  );
};

const Providers = (context: LambdaContext) => [
  {
    provide: RESOLVER_HOOK,
    useFactory: () => (resolver: GenericGapiResolversType) => {
      const resolve = resolver.resolve.bind(resolver.target);
      resolver.resolve = async function (root, args, context, info, ...a) {
        /*
         *  Here every resolver can be modified even we can check for the result and strip some field
         *  Advanced logic for authentication can be applied here using @gapi/ac or equivalent package
         */
        return resolve(root, args, context, info, ...a);
      };
      return resolver;
    },
  },
  {
    provide: ON_REQUEST_HANDLER,
    useFactory: () => (next: (context: LambdaContext) => LambdaContext, request: Request) => {
      /* Every request comming from client will be processed here so we can put user context or other context here */

      console.log('Request initiated', request['payload']);
      /* Fetch user and make authorization then attach context to the resolvers */
      // request.headers.authorization
      return next(context);
    },
  },
  {
    provide: CONNECTION_TOKEN,
    lazy: true,
    useFactory: async () => {
      const environment = await context.getSecret<{ MONGODB_URI: string }>('environment');
      return connect(environment.MONGODB_URI);
    },
  },
];

if (process.env.NODE_ENV === 'development') {
  BootstrapApp(
    Providers({
      getSecret: () => Promise.resolve({ MONGODB_URI: process.env.MONGODB_URI }),
    } as never as LambdaContext)
  );
}

export default async function handler(context: LambdaContext) {
  const request = context.request;

  const headers = {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': context.request.headers['origin'],
    'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
  };

  if (request.method === 'options') {
    console.log(context.request.headers['origin']);
    const originsSecret = await context.getSecret('allowed-origins');
    const allowedOrigins = originsSecret.values.split(',');
    const isAllowed = allowedOrigins.includes(context.request.headers['origin']);
    console.log(context.request.headers['origin'], isAllowed);
    if (!isAllowed) {
      return {
        status: 503,
        body: {
          error: 'Origin not allowed!',
        },
      };
    }

    return {
      status: 200,
      body: {
        origin: context.request.headers['origin'],
      },
      headers,
    };
  }

  // Use LambdaContext for type hinting
  // Ensure the app is bootstrapped before handling the request
  await BootstrapApp(Providers(context));

  const url = format({
    pathname: '/graphql',
    query: request.query,
  } as never);
  const options = {
    method: request.method,
    url,
    payload: request.body,
    headers: request.headers as never,
    validate: false,
  } as ServerInjectOptions;
  let res = {
    statusCode: 502,
    result: null,
  };
  console.log('Request Options: ', options);
  try {
    res = await Container.get<Server>(HAPI_SERVER).inject(options);
  } catch (e) {
    console.error('ERROR', JSON.stringify(e));
  }
  return {
    status: res.statusCode,
    body: res.result,
    headers,
  };
}
