import { BadRequestException, Injectable } from '@nestjs/common';

import { DatabaseRepository } from '../database.repository';
import {
  HubspotModel,
  collection,
  converter,
  HubspotContact,
} from './hubspot.model';

@Injectable()
export class HubspotRepository extends DatabaseRepository<HubspotModel> {
  collection = collection;
  converter = converter;
  async create(hubspotModel: HubspotModel) {
    const data = await this.add(hubspotModel);
    return data.id;
  }

  async createTicketConversationAssociation(
    hubspotId: number,
    conversationId: string,
    ticketId: string
  ) {
    const hsSnapshot = await this.where('accountId', '==', hubspotId).get();
    const data = this.extractOne(hsSnapshot);
    const docRef = data?.docRef;

    if (docRef === undefined)
      throw new BadRequestException('Hubspot ID is not in the database');

    await this.update(
      docRef,
      `associations.conversation_ticket.${conversationId}`,
      ticketId
    );
  }

  async findTicketConversationAssociation(
    hubspotId: number,
    conversationId: string
  ): Promise<string | undefined> {
    const docs = await this.where('accountId', '==', hubspotId)
      .select(`associations.conversation_ticket.${conversationId}`)
      .get();
    const ticketId = docs.docs[0].get(
      `associations.conversation_ticket.${conversationId}`
    );

    return ticketId;
  }

  async getByAccountId(account_id: number) {
    const snapshot = await this.where('accountId', '==', account_id).get();
    const data = this.extractOne(snapshot);

    return data;
  }

  async getDocRefByAccountId(account_id: number) {
    const snapshot = await this.where('accountId', '==', account_id).get();
    const data = this.extractOne(snapshot);
    if (data === undefined) throw new Error('Invalid Hubspot account ID');
    return data.docRef;
  }

  async updateContacts(docRef: string, contacts: HubspotContact[]) {
    await this.update(
      docRef,
      'contacts',
      contacts.map((contact) => {
        return {
          email: contact.email,
          recordings: contact.recordings,
        };
      })
    );
  }

  async getAccessTokenByAccountId(accountId: number) {
    const snapshot = await this.where('accountId', '==', accountId).get();
    const data = this.extractOne(snapshot);
    return data?.data.accessToken;
  }

  async updateAccessToken(
    docRef: string,
    newToken: string,
    expirationDate: number
  ) {
    this.update(docRef, 'accessToken', newToken);
    this.update(docRef, 'tokenExpiration', expirationDate);
  }
}
