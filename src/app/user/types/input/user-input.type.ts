import { GraphQLInputObjectType, GraphQLString } from '@gapi/core';

export const UserInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
  }),
});
