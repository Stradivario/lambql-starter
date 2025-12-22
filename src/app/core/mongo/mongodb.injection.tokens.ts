import { IUserType } from '@core/introspection';
import { InjectionToken } from '@rxdi/core';
import { Model, Mongoose } from 'mongoose';

export const CONNECTION_TOKEN = new InjectionToken<Mongoose>('mongodb-connection-token');

export interface DatabaseModels {
  user: Model<IUserType>;
}

export const DatabaseModels = new InjectionToken<DatabaseModels>('mongodb-database-models');
