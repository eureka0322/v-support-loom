import { Injectable } from '@nestjs/common';

import { DatabaseRepository } from '../database.repository';
import { Button, collection, converter } from './button.model';

@Injectable()
export class ButtonRepository extends DatabaseRepository<Button> {
  collection = collection;
  converter = converter;

  async submitButton(button: Button) {
    const data = await this.add(button);
    return data.id;
  }

  async getButtonByEmail(email: string) {
    const snapshot = await this.where('email', '==', email).get();
    const data = this.extractOne(snapshot);
    return data;
  }
}
