import { BadRequestException, Injectable } from '@nestjs/common';

import { DatabaseRepository } from '../database.repository';
import { User, collection, converter } from './users.model';

@Injectable()
export class UsersRepository extends DatabaseRepository<User> {
  collection = collection;
  converter = converter;

  async addPassword(id: string, hashedPassword: string) {
    await this.doc(id).update({
      hashedPassword,
    });
  }

  async updateUserCrispWidgetStatus(organizationId: string, toUpdate: {
      crisp_client_id?: string;
    }) {
    //return await this.doc(id).update(toUpdate);
    await this.where('organizationId', '==', organizationId).get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.update(toUpdate)//not doc.update({foo: "bar"})
        });
   })
  }

  async updatePassword(id: string, toUpdate: {
      hashedPassword?: string,
    }) {
    if(await this.doc(id).update(toUpdate)) {
      return true
    } else {
      return false
    }
  }

  async getByClientId(id: string) {
    const snapshot = await this.where('organizationId', '==', id).get();
    const data = this.extract(snapshot);
    return data.map((doc: { docRef: string; data: User }) => {
      return doc.data;
    });
  }

  async getAdminByClientId(id: string) {
    const snapshot = await this.where('organizationId', '==', id)
        .where('organizationRole', '==', 'admin')
        .get();
    const data = this.extract(snapshot);
    return data.map((doc: { docRef: string; data: User }) => {
      return doc.data;
    });
  }

  async getById(id: string) {
    const snapshot = await this.where('id', '==', id).get();
    const data = this.extractOne(snapshot);
    return data;
  }

  async getUserByEmail(email: string) {
    const lowerEmail = email.toLowerCase();
    const snapshot = await this.where('email', '==', lowerEmail).get();
    const data = this.extractOne(snapshot);
    return data;
  }

  async getUserForCrispWidget(clientId:string, email: string) {

    const lowerEmail = email.toLowerCase();
    const snapshot = await this.where('crisp_client_id', '==', clientId)
        .where('email', '==', lowerEmail)
        .get();
    return this.extractOne(snapshot);
  }

  async getUserByClientId(clientId: string) {
    const snapshot = await this.where('crisp_client_id', '==', clientId).get();
    const data = this.extractOne(snapshot);
    return data;
  }

  async createUser(user: User) {
    console.log('createUser = ', user)
    const userData = await this.doc(user.id).set(user);
    return user.id;
  }

  async updateSeats(clientId: string, seats: { [key: string]: boolean }) {
    let docRefPromises = [];
    let newSeats = 0;
    for (const key in seats) {
      const doc = this.where('organizationId', '==', clientId)
        .where('id', '==', key)
        .get();
      docRefPromises.push(doc);
      if (seats[key]) newSeats += 1;
    }
    const docRefs = (await Promise.all(docRefPromises)).map((value) => {
      const data = this.extractOne(value);
      if (data === undefined) {
        throw new BadRequestException('Bad user');
      }
      return {
        docRef: data.docRef,
        hasSeat: seats[data.data.id],
      };
    });

    const updatePromises = docRefs.map((doc) => {
      return this.doc(doc.docRef).update('hasSeat', doc.hasSeat);
    });

    await Promise.all(updatePromises);
    return newSeats;
  }

  async updateEmail(userId: string, newEmail: string): Promise<void> {
    await this.doc(userId).set({ email: newEmail }, { merge: true });
  }
}
