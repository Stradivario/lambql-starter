// import { DatabaseModels } from '@core/mongo';
import { IUserType } from '@core/introspection';
import { Boom, Container, GRAPHQL_PLUGIN_CONFIG } from '@gapi/core';
import { GraphqlContext } from '@shared/context';
// import { ObjectId } from 'mongodb';
async function validateToken(token: string) {
  try {
    const fakeUser: IUserType = {
      id: 1,
      name: 'Lorem Ipsumov',
      email: '',
      type: 'ADMIN',
    };
    /* Validate token and fetch credentials for the user */
    // const models = Container.get(DatabaseModels);
    // const user = await models.user.findOne({ _id: new ObjectId('') });
    return { user: fakeUser } as GraphqlContext;
  } catch (e) {
    console.error(`[GATEWAY][ERROR]: ${e?.errorInfo?.code ?? e?.code} ${e?.errorInfo?.message ?? e?.message}`);
    return null;
  }
}

export const onRequest = async (next, request) => {
  console.log(
    '[Request Started]',
    {
      host: request.info.host,
      hostname: request.info.hostname,
      id: request.info.id,
      cors: request.info.cors,
    },
    '-->',
    request.payload
  );
  const config = Container.get(GRAPHQL_PLUGIN_CONFIG);

  if (request.headers.authorization && request.headers.authorization !== 'undefined') {
    try {
      config.graphqlOptions.context = await validateToken(request.headers.authorization);
      console.log('Success validated authorization for user');
    } catch (e) {
      console.log('API_STATUS: ', e);
      return Boom.unauthorized(e);
    }
  } else {
    config.graphqlOptions.context = {
      user: null,
    };
  }
  return next();
};
