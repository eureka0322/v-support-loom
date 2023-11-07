import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';

import { DatabaseRepository } from '../database.repository';
import { Plugins, collection, converter } from './plugins.model';

@Injectable()
export class PluginsRepository extends DatabaseRepository<Plugins> {
  collection = collection;
  converter = converter;

  async retrieve(name: string) {
    return (await this.doc(name).get()).data();
  }
}
