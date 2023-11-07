import { Injectable } from '@nestjs/common';

import { DatabaseRepository } from '../database.repository';
import { PotentialUser, collection, converter } from './potential-users.model';

@Injectable()
export class PotentialUsersRepository extends DatabaseRepository<PotentialUser> {
  collection = collection;
  converter = converter;

  async getAllUsers() {
    const snapshot = await this.get();
    const data = this.extract(snapshot);
    return data;
  }

  async getUserById(id: string) {
    const snapshot = await this.where('id', '==', id).get();
    const data = this.extractOne(snapshot);
    return data;
  }

  async addPotentialUser(potentialUser: PotentialUser) {
    const potentialUserData = await this.add(potentialUser);
    return potentialUserData.id;
  }

  async findUpdateOrCreate(potentialUser: PotentialUser) {
    const dbUser = await this.getUserById(potentialUser.id);

    if (dbUser) {
      console.log('[potential-users.repo][found]');

      return dbUser.data;
    }

    const newPotentialUser = new PotentialUser(
      potentialUser.id,
      potentialUser.name,
      potentialUser.email,
      potentialUser.workspaceId,
    );
    const newPotentialUserDocRefId = await this.addPotentialUser(
      newPotentialUser,
    );

    if (newPotentialUserDocRefId) {
      console.log('[potential-users.repo][added]');
      return newPotentialUser;
    }

    return undefined;
  }
}
