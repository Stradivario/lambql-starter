import { IUserType } from '@core/introspection';
import { Model, model, Schema } from 'mongoose';

import { GlobalModelOptions } from './mongoose.transformers';

export enum UserTypeEnum {
  GUEST = 1,
  USER = 2,
  ADMIN = 3,
}

const UserSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    type: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  GlobalModelOptions
);

export const UserModel = model<IUserType, Model<IUserType>>('user', UserSchema, 'user');
