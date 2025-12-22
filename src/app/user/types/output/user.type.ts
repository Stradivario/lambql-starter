import { UserTypeEnum } from '@core/mongo/models';
import { GraphQLEnumType, GraphQLObjectType, GraphQLString } from '@gapi/core';

export const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: (root) => root.id ?? root._id,
    },
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    type: {
      type: new GraphQLEnumType({
        name: 'UserTypeEnum',
        values: Object.keys(UserTypeEnum)
          .map((key) => UserTypeEnum[key])
          .filter((value) => typeof value === 'string')
          .reduce((prev, curr) => ({ ...prev, [curr]: { value: curr } }), {}),
      }),
    },
  }),
});
