import { Injectable } from '@nestjs/common';

import { DatabaseRepository } from '../database/database.repository';
import { IntercomModel, collection, converter } from './intercom.model';

@Injectable()
export class IntercomRepository extends DatabaseRepository<IntercomModel> {
  collection = collection;
  converter = converter;

  async getUserById(id: string) {
    const snapshot = await this.where('id', '==', id).get();
    const data = this.extractOne(snapshot);

    return data;
  }

  async getByWorkspaceId(workspaceId: string) {
    const snapshot = await this.where('workspaceId', '==', workspaceId).get();
    const data = this.extractOne(snapshot);
    return data;
  }
  async getUserByWorkspaceIdAnAdmindId(adminId: string, workspaceId: string) {
    const snapshot = await this.where('workspaceId', '==', workspaceId)
      .where('id', '==', adminId)
      .get();
    const data = this.extractOne(snapshot);

    return data;
  }

  async getUsersByWorkspaceId(workspaceId: string) {
    const snapshot = await this.where('workspaceId', '==', workspaceId).get();
    const data = this.extract(snapshot);

    return data;
  }

  async createUser(user: IntercomModel) {
    console.log('[Intercom.repo][createUser]');
    const data = await this.add(user);
    return data.id;
  }

  async updateAccessToken(docRef: string, accessToken: string) {
    await this.update(docRef, 'accessToken', accessToken);
  }
  async updateUserSeat(docRef: string, seat: boolean) {
    console.log('[updateUserSeat]');
    const videosupportSeat = await this.update(
      docRef,
      'videosupport_seat',
      seat
    );

    if (videosupportSeat) {
      return {
        status: 'ok',
        message: 'success',
      };
    }
  }

  async updateVideosupportSeating(docRef: string) {
    if (docRef) {
      await this.update(docRef, 'videosupport_seat', true);
    }

    return {
      status: 'ok',
    };
  }
}
