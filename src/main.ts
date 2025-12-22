import { Bootstrap, Container, HAPI_SERVER } from '@gapi/core';
import { Server, ServerInjectOptions } from 'hapi';
import { lastValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { format } from 'url';

import { AppModule } from './app/app.module';
import { LambdaContext } from './context';

const Main = lastValueFrom(
  Bootstrap(AppModule).pipe(
    tap(() => {
      console.log('[Bootstrap]: Started');
    })
  )
);

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

  await Main;

  const url = format({
    pathname: request.path + 'graphql',
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
