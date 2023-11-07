import { BadRequestException, Injectable } from '@nestjs/common';

import { DatabaseRepository } from '../database.repository';
import { ApiLink, collection, converter } from './api-link.model';

@Injectable()
export class ApiLinkRepository extends DatabaseRepository<ApiLink> {
  collection = collection;
  converter = converter;

  async create(apiLink: ApiLink) {
    const data = await this.doc(apiLink.linkId).set(apiLink);
    return apiLink.linkId;
  }

  async getById(id: string) {
    const snapshot = await this.where('linkId', '==', id).get();
    const data = this.extractOne(snapshot);
    if (data === undefined) {
      throw new BadRequestException('Link not found in database');
    }
    return data.data;
  }
}
