import { IUserInput, IUserType } from '@core/introspection';
import { DatabaseModels } from '@core/mongo';
import { UserTypeEnum } from '@core/mongo/models';
import { Inject, Injectable } from '@gapi/core';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(@Inject(DatabaseModels) private models: DatabaseModels) {}

  async getUsers(): Promise<IUserType[]> {
    return await this.models.user.find();
  }

  async getUserById(id: number): Promise<IUserType> {
    return await this.models.user.findById(id);
  }

  createUser(name: string, email: string): Promise<IUserType> {
    return this.models.user.create({ name, email, type: UserTypeEnum.USER });
  }

  createAdmin(name: string, email: string): Promise<IUserType> {
    return this.models.user.create({ name, email, type: UserTypeEnum.ADMIN });
  }

  async updateUser(id: number, payload: IUserInput): Promise<IUserType> {
    return this.models.user.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      payload,
      { new: true }
    );
  }

  async deleteUser(id: number): Promise<IUserType> {
    return this.models.user.findOneAndRemove({ _id: new ObjectId(id) });
  }
}
