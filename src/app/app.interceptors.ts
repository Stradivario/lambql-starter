import { Boom, GenericGapiResolversType, HookService, ON_REQUEST_HANDLER, RESOLVER_HOOK } from '@gapi/core';
import { Module, ModuleWithProviders } from '@rxdi/core';

import { ac } from './app.permissions';
import { onRequest } from './app.request';

@Module()
export class AppInterceptors {
  public static forRoot(): ModuleWithProviders {
    return {
      module: AppInterceptors,
      providers: [
        {
          provide: RESOLVER_HOOK,
          deps: [HookService],
          useFactory: (hooks: HookService) => (resolver: GenericGapiResolversType) => {
            const resolve = resolver.resolve.bind(resolver.target);
            resolver.resolve = async function (root, args, context, info, ...a) {
              const resource = resolver.method_name as never;
              const resolverType = resolver.method_type;
              const userType = context.user?.type || 'GUEST';

              console.log('');
              const date = Date.now();
              console.log(`[START][MAIN][${userType}][${resource}][${resolverType}]`);

              console.log('[Arguments]: ', args);
              const can = ac.validate(userType, resolverType, resource);
              console.log(`[User]: `, { email: context?.user?.email });
              if (!(await can(args, context))) {
                throw Boom.unauthorized('You are not authorized');
              }
              const data = await resolve(root, args, context, info, ...a);
              const filtered = await ac.filter(userType, resolverType, resource)(data);
              console.log(`[END][MAIN][${userType}][${resource}][${resolverType}][${(Date.now() - date) / 1000}]`);
              console.log('');
              return filtered;
            };
            return resolver;
          },
        },
        {
          provide: ON_REQUEST_HANDLER,
          useFactory: () => onRequest,
        },
      ],
    };
  }
}
