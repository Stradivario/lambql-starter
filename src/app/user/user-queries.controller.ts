import { Controller, GraphQLList, GraphQLNonNull, GraphQLString, Query, Type } from '@gapi/core';
import { GraphqlContext } from '@shared/context';

import { UserType } from './types';
import { UserService } from './user.service';

@Controller()
export class UserQueriesController {
  constructor(private readonly userService: UserService) {}

  @Type(UserType)
  @Query({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  })
  findUser(_root, { id }, context: GraphqlContext) {
    return this.userService.getUserById(id);
  }

  @Type(new GraphQLList(UserType))
  @Query()
  async getUsers() {
    const data = await this.userService.getUsers();
    console.log(data);
    return data;
  }
}
