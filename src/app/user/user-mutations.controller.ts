import { Controller, GraphQLNonNull, GraphQLString, Mutation, Type } from '@gapi/core';
import { GraphqlContext } from '@shared/context';

import { UserInputType, UserType } from './types';
import { UserService } from './user.service';

@Controller()
export class UserMutationsController {
  constructor(private readonly userService: UserService) {}

  @Type(UserType)
  @Mutation({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
  })
  createUser(_root, { name, email }, context: GraphqlContext) {
    return this.userService.createUser(name, email);
  }

  @Type(UserType)
  @Mutation({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
  })
  createAdmin(_root, { name, email }, context: GraphqlContext) {
    return this.userService.createAdmin(name, email);
  }

  @Type(UserType)
  @Mutation({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userInput: {
      type: new GraphQLNonNull(UserInputType),
    },
  })
  updateUser(_root, { id, userInput }, context: GraphqlContext) {
    return this.userService.updateUser(id, {
      email: userInput.email,
      name: userInput.name,
    });
  }

  @Type(UserType)
  @Mutation({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  })
  deleteUser(_root, { id }, context: GraphqlContext) {
    return this.userService.deleteUser(id);
  }
}
