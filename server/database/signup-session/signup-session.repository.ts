import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';

import { DatabaseRepository } from '../database.repository';
import { SignupSession, collection, converter } from './signup-session.model';

@Injectable()
export class SignupSessionRepository extends DatabaseRepository<SignupSession> {
  collection = collection;
  converter = converter;

  async create(id: string, expiration: number, usages: number) {
    await this.doc(id).set({ expiration, usages });
  }

  async useOnce(id: string) {
    const signupRef = this.doc(id);
    const authorized = await this.runTransaction(async (t) => {
      const doc = await t.get(signupRef);
      const data = doc.data();
      if (data && data.usages > 0 && data.expiration > Date.now()) {
        t.update(signupRef, {
          usages: firestore.FieldValue.increment(-1),
        });
        return true;
      }
      return false;
    });
    return authorized;
  }
}
