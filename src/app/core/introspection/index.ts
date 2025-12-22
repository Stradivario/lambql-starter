/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
 // tslint:disable
// graphql typescript definitions


  export interface IGraphQLResponseRoot {
    data?: IQuery | IMutation;
    errors?: Array<IGraphQLResponseError>;
  }

  export interface IGraphQLResponseError {
    message: string;            // Required for all errors
    locations?: Array<IGraphQLResponseErrorLocation>;
    [propName: string]: any;    // 7.2.2 says 'GraphQL servers may provide additional entries to error'
  }

  export interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  /**
    description?: Query type for all get requests which will not change persistent data
  */
  export interface IQuery {
    __typename?: "Query";
    status?: IStatusQueryType | null;
    _service?: IGraphqlFederation | null;
    findUser?: IUserType | null;
    getUsers?: Array<IUserType> | null;
}

  
  export interface IStatusQueryType {
    __typename?: "StatusQueryType";
    status?: string | null;
}

  
  export interface IGraphqlFederation {
    __typename?: "GraphqlFederation";
    sdl?: string | null;
}

  
  export interface IUserType {
    __typename?: "UserType";
    id?: number | null;
    name?: string | null;
    email?: string | null;
    type?: IUserTypeEnumEnum | null;
}

export   
  type IUserTypeEnumEnum = 'GUEST' | 'USER' | 'ADMIN';

  /**
    description?: Mutation type for all requests which will change persistent data
  */
  export interface IMutation {
    __typename?: "Mutation";
    createUser?: IUserType | null;
    createAdmin?: IUserType | null;
    updateUser?: IUserType | null;
    deleteUser?: number | null;
}

  
  export interface IUserInput {
    name?: string | null;
    email?: string | null;
}


// tslint:enable
