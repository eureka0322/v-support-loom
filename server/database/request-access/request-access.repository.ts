import { Injectable } from '@nestjs/common';

import { DatabaseRepository } from '../database.repository';
import { RequestAccess, collection, converter } from './request-access.model';

@Injectable()
export class RequestAccessRepository extends DatabaseRepository<RequestAccess> {
  collection = collection;
  converter = converter;

  async addRequest(request: RequestAccess) {
    const requestAccessData = await this.add(request);
    return requestAccessData.id;
  }
}
