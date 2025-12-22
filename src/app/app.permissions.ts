import { IMutation, IQuery } from '@core/introspection';
import { UserTypeEnum } from '@core/mongo/models';
import { AccessControl, GenericEnumType, Unboxed, Union } from '@gapi/ac';
import { GraphqlContext } from '@shared/context';

enum GraphqlActions {
  query,
  mutation,
  subscription,
  event,
}

type UnionWithoutRoles<Resolvers, Actions, Context> = {
  [resolver in keyof Resolvers]: Partial<
    Record<
      keyof Actions,
      {
        validators?: ((args: Unboxed<Resolvers[resolver]>, context: Context) => boolean | Promise<boolean>)[];
        enabled: boolean;
        attributes?: GenericEnumType<Unboxed<Resolvers[resolver]>, boolean>;
      }
    >
  >;
};

type NodesUnion = UnionWithoutRoles<IQuery & IMutation, typeof GraphqlActions, GraphqlContext>;

const GUEST: NodesUnion = {
  /* Enable Apollo Federation to fetch our schema and to be part of federated graph */
  _service: {
    query: {
      enabled: true,
    },
  },
  status: {
    query: {
      enabled: true,
    },
  },
};

const USER: NodesUnion = {
  ...GUEST,
  createUser: {
    mutation: {
      enabled: true,
    },
  },
  getUsers: {
    query: {
      enabled: true,
    },
  },
  updateUser: {
    mutation: {
      enabled: true,
    },
  },
  findUser: {
    query: {
      enabled: true,
    },
  },
};

const Permissions: Union<typeof UserTypeEnum, IQuery | IMutation, typeof GraphqlActions> = {
  GUEST,
  USER,
  ADMIN: {
    ...USER,
    deleteUser: {
      mutation: {
        enabled: true,
      },
    },
    createAdmin: {
      mutation: {
        enabled: true,
      },
    },
  },
};

export const ac = new AccessControl<typeof UserTypeEnum, IQuery | IMutation, typeof GraphqlActions>(Permissions);
