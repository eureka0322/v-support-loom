import { Injectable } from '@nestjs/common';

import { DatabaseRepository } from '../database.repository';
import { Workspace, collection, converter } from './workspace.model';

@Injectable()
export class WorkspaceRepository extends DatabaseRepository<Workspace> {
  collection = collection;
  converter = converter;

  async getAllowedWorkspaces(id: string) {
    const snapshot = await this.doc(id).get();
    const data = snapshot.data();

    return data;
  }
}
