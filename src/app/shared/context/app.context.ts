import { IUserType } from '@core/introspection';

export interface GraphqlContext {
  user: IUserType;
}

export type WithPayload<T> = { payload: T };
