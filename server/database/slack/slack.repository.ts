import { BadRequestException, Injectable } from '@nestjs/common';

import { DatabaseRepository } from '../database.repository';
import { SlackModel, collection, converter } from './slack.model';

@Injectable()
export class SlackRepository extends DatabaseRepository<SlackModel> {
  collection = collection;
  converter = converter;

  async create(teamId: string, payload: any) {
    await this.doc(teamId).set(payload);
  }

  async getByTeamId(teamId: string) {
    return (await this.doc(teamId).get()).data();
  }
}
