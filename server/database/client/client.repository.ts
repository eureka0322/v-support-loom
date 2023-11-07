import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseRepository } from '../database.repository';
import { Client, collection, converter } from './client.model';
import { firestore } from 'firebase-admin';

@Injectable()
export class ClientRepository extends DatabaseRepository<Client> {
  collection = collection;
  converter = converter;

  async updateSeats(clientId: string, seats: number) {
    await this.doc(clientId).update({
      'settings.seats': seats,
    });
  }

  async addHook(
    clientId: string,
    hook: { id: string; name: string; url: string; data: any }
  ) {
    await this.update(clientId, `settings.defaultHooks.${hook.id}`, {
      name: hook.name,
      url: hook.url,
      data: hook.data,
    });
  }

  async deleteHook(clientId: string, hookId: string) {
    await this.update(
      clientId,
      `settings.defaultHooks.${hookId}`,
      firestore.FieldValue.delete()
    );
  }

  async addIntegration(
    clientId: string,
    integrationName: string,
    data: { [key: string]: string }
  ) {
    await this.update(
      clientId,
      `settings.integrations.${integrationName}`,
      data
    );
  }

  async getBySlackTeamId(teamId: string) {
    const snapshot = await this.where(
      'settings.integrations.slack.teamId',
      '==',
      teamId
    ).get();
    return this.extractOne(snapshot);
  }

  async deleteClient(clientId: string) {
    const client = await this.where('clientId', '==', clientId).get();
    const docRef = this.extractOne(client)?.docRef;

    if (docRef === undefined) {
      throw new BadRequestException("Deleting client that couldn't be found");
    }

    await this.doc(docRef).delete();
  }

  async getClientBySubscription(id: string) {
    const snapshot = await this.where('subscription', '==', id).get();
    const data = this.extractOne(snapshot);

    return data;
  }

  async getClientByClientId(id: string) {
    const snapshot = await this.where('id', '==', id).get();
    const data = this.extractOne(snapshot);

    return data;
  }

  async getByIntercomId(id: string) {
    const snapshot = await this.where(
      'settings.integrations.intercom.workspaceId',
      '==',
      id
    ).get();
    const data = this.extractOne(snapshot);
    return data;
  }

  async getClientByCrispId(id: string) {
    const snapshot = await this.where(
      'settings.integrations.crisp.websiteId',
      '==',
      id
    ).get();
    const data = this.extractOne(snapshot);

    return data;
  }

  async getAllClients() {
    const snapshot = await this.where(
      'settings.integrations.crisp.websiteId',
      '!=',
      ''
    ).get();
    const data = this.extract(snapshot);
    return data;
  }

  async getClientByZendeskId(id: string) {
    const snapshot = await this.where(
      'settings.integrations.zendesk.subdomain',
      '==',
      id
    ).get();
    const data = this.extractOne(snapshot);

    return data;
  }

  async getClientByWidgetId(id: string) {
    const snapshot = await this.where('settings.web.widget_id', '==', id).get();
    const data = this.extractOne(snapshot);

    return data;
  }
  async incrementRecordingAmountCounter(clientId: string) {
    const snapshot = await this.where('id', '==', clientId).get();
    const client = this.extractOne(snapshot);

    if (client) {
      const increment = firestore.FieldValue.increment(1);
      this.doc(client.docRef).update({ recordingAmount: increment });
    } else {
      throw new BadRequestException();
    }
  }
  async createClient(client: Client) {
    await this.doc(client.id).set(client);
    return client;
  }

  async updateRecordingAmount(docRef: string, recordingAmount: number) {
    if (recordingAmount) {
      await this.update(docRef, 'recordingAmount', recordingAmount);
    }

    return {
      status: 'ok',
    };
  }

  async incrementSeats(clientId: string, seats: number) {
    const increment = firestore.FieldValue.increment(seats);
    await this.doc(clientId).update({ 'settings.seats': increment });
  }

  // TODO(Joao): _check_v2
  // Remove, legacy
  async updateClientSeating(docRef: string) {
    if (docRef) {
      await this.update(docRef, 'settings.seats', 1);
    }

    return {
      status: 'ok',
    };
  }

  async updateClientHubspot(clientDocRef: string, hubspotDocRef: string) {
    if (clientDocRef && hubspotDocRef) {
      await this.update(
        clientDocRef,
        'settings.integrations.hubspot',
        hubspotDocRef
      );
    }

    return {
      status: 'ok',
    };
  }

  async getClientByHubspotId(hubspotId: number) {
    const res = await this.where(
      'settings.integrations.hubspot.accountId',
      '==',
      hubspotId
    ).get();
    let data = this.extractOne(res);
    return data;
  }

  async updateBranding(
    clientId: string,
    primaryColour: string,
    secondaryColour: string,
    logo: string
  ) {
    const pcUpdate = this.update(
      clientId,
      'settings.app.branding.primary_colour',
      primaryColour
    );
    const scUpdate = this.update(
      clientId,
      'settings.app.branding.secondary_colour',
      secondaryColour
    );
    const logoUpdate = this.update(
      clientId,
      'settings.app.branding.logo',
      logo
    );

    await Promise.all([pcUpdate, scUpdate, logoUpdate]);
  }

  async updateAppSettings(clientId: string, referrerUrl: string) {
    await this.update(clientId, 'settings.app.referrerUrl', referrerUrl);
  }

  async updateAppHook(
    clientId: string,
    id: string,
    fieldName: string,
    value: string | string[]
  ) {
    await this.update(
      clientId,
      `settings.defaultHooks.${id}.data.${fieldName}`,
      value
    );
  }
}
