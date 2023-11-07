import { Injectable, BadRequestException } from '@nestjs/common';

import { DatabaseRepository } from '../database.repository';
import { Recording, collection, converter } from './recording.model';

@Injectable()
export class RecordingRepository extends DatabaseRepository<Recording> {
  collection = collection;
  converter = converter;

  async getAll(clientId: string, limit: number) {
    const snapshot = await this.where('clientId', '==', clientId)
      .orderBy('recording.recordedAt', 'desc')
      .limit(limit)
      .get();
    return this.extract(snapshot);
  }
  async atomicUpdateAssignee(recordingId: string, assigneeEmail: string) {
    const recordingRef = this.doc(recordingId);
    const data = await this.runTransaction(async (t) => {
      const doc = await t.get(recordingRef);
      const newAssigned = {
        assigned: {
          status: true,
          email: assigneeEmail,
        },
      };
      if (!doc.data()?.assigned || !doc.data()?.assigned?.status) {
        t.update(recordingRef, newAssigned);
        return newAssigned;
      }
      return doc.data()?.assigned;
    });
    return data;
  }

  async updateReservedMetadata(
    recordingRefId: string,
    reservedMetadata: { [key: string]: string | number | boolean }
  ) {
    let promises = [];
    for (const key in reservedMetadata) {
      promises.push(
        this.update(
          recordingRefId,
          `reservedMetadata.${key}`,
          reservedMetadata[key]
        )
      );
    }
    await Promise.all(promises);
  }

  async getMatching(clientId: string, match: { [key: string]: string }) {
    let promises = [];
    for (const key in match) {
      const snapshot = this.where('clientId', '==', clientId)
        .where(key, '==', match[key])
        .get();
      promises.push(snapshot);
    }
    const snapshots = await Promise.all(promises);

    let results: {
      docRef: string;
      data: Recording;
    }[] = [];
    for (const s of snapshots) {
      const data = this.extract(s);
      results = results.concat(data);
    }
    return results;
  }

  async getUnassigned(clientId: string, limit: number) {
    const snapshot = await this.where('clientId', '==', clientId)
      .where('assigned.status', '==', false)
      .orderBy('recording.recordedAt', 'desc')
      .limit(limit)
      .get();
    return this.extract(snapshot).map((res) => {
      return res.data;
    });
  }

  async updateMetadata(
    recordingRefId: string,
    metadata: { [key: string]: string | number | boolean }
  ) {
    let promises = [];
    for (const key in metadata) {
      // Field paths in firestore cannot be empty nor contain *~/[]
      if (key && key.trim().length !== 0) {
        const fieldPath = key.replace(/[\/~.*\[\]]/g, '_');
        promises.push(
          this.update(recordingRefId, `metadata.${fieldPath}`, metadata[key])
        );
      }
    }
    await Promise.all(promises);
  }

  async getByIntercomContactId(clientId: string, contactId: string) {
    const snapshot = await this.where('clientId', '==', clientId)
      .where('reservedMetadata.intercomContactId', '==', contactId)
      .get();
    const data = this.extract(snapshot);
    return data;
  }

  async getByUuid(recordingId: string) {
    const snapshot = await this.where('id', '==', recordingId).get();
    const data = this.extractOne(snapshot);
    return data;
  }

  async getRecordings() {
    const snapshot = await this.get();
    const data = this.extract(snapshot);

    return data;
  }

  async getRecordingsByClientId(id: string) {
    const snapshot = await this.where('clientId', '==', id).get();
    const data = this.extract(snapshot);

    return data;
  }

  async updateRecordingById(id: string, updatedData: any) {
    console.log("###########");
    await this.doc(id).update(updatedData);
    // const updatedSnapshot = await this.doc(id).get();
    // const updatedRecording = this.extract(updatedSnapshot);
    return true;
  }

  async deleteRecordingById(id: string) {
    console.log(id);
    await this.doc(id).delete();
  }

  async getDocumentById(id: string) {
    const snapshot = await this.doc(id).get();
    const data = snapshot.data();

    if (data === undefined) {
      throw new BadRequestException('Recording not found in database');
    }

    return data;
  }

  async checkRecordingToDb(linkId: string) {
    const snapshot = await this.where('linkId', '==', linkId).get();
    const data = this.extract(snapshot);

    return data;
  }

  async addRecording(recording: Recording) {
    const data = await this.doc(recording.id).set(recording);

    return recording.id;
  }

  async getRecordingsBySubdomainWithFilters(
    subdomain: string,
    start: string,
    end: string
  ) {
    const snapshot = await this.where('zendesk.subdomain', '==', subdomain)
      .where('recording.recordedAt', '>=', parseInt(start, 10))
      .where('recording.recordedAt', '<=', parseInt(end, 10))
      .get();
    const data = this.extract(snapshot);

    return data;
  }

  async getRecordingsBySubdomain(subdomain: string) {
    const snapshot = await this.where(
      'zendesk.subdomain',
      '==',
      subdomain
    ).get();
    const data = this.extract(snapshot);

    return data;
  }

  async getRecordingsByZendeskVisitorId(id: string) {
    const snapshot = await this.where('zendesk.visitorId', '==', id).get();
    const data = this.extract(snapshot);

    return data;
  }

  async getScreenRecordingsByZendeskVisitorId(id: string) {
    const snapshot = await this.where('zendesk.user.id', '==', id).get();
    const data = this.extract(snapshot);

    return data;
  }

  async getRecordingsByZendeskVisitorEmail(email: string) {
    const snapshot = await this.where(
      'zendesk.visitorEmail',
      '==',
      email
    ).get();
    const data = this.extract(snapshot);

    return data;
  }

  async getScreenRecordingsByZendeskVisitorEmail(email: string) {
    const snapshot = await this.where('zendesk.user.email', '==', email).get();
    const data = this.extract(snapshot);

    return data;
  }

  async getRecordingsByWidgetId(widgetId: string) {
    const snapshot = await this.where('web.widgetId', '==', widgetId).get();
    const data = this.extract(snapshot);

    return data;
  }

  async getRecordingsByContactId(contactId: string) {
    const snapshot = await this.where(
      'intercom.contactId',
      '==',
      contactId
    ).get();
    const data = this.extract(snapshot);

    return data;
  }

  async getAPIRecordingsByContactId(contactId: string, from: string) {
    const frm = from ? parseInt(from, 10) : 0;

    const snapshot = await this.where('intercom.contactId', '==', contactId)
      .where('recording.recordedAt', '>=', frm)
      .orderBy('recording.recordedAt', 'desc')
      .get();
    const data = this.extract(snapshot);

    const APIObject: any = [];
    Object.values(data).forEach((data) => {
      const video = {
        videoUrl: data.data.recording.videoUrl,
        createdAt: data.data.recording.recordedAt,
        note: data.data.recording.message,
      };

      APIObject.push(video);
    });

    return APIObject;
  }

  async getRecordingByCustomerEmail(clientId: string, email: string) {
    const snapshot = await this.where('clientId', '==', clientId)
      .where('customer.email', '==', email)
      .get();
    const data = this.extract(snapshot);
    return data;
  }

  async getRecordingByHubspotTicketId(ticketId: string) {
    const snapshot = await this.where(
      'metadata.hubspotTicketId',
      '==',
      ticketId
    ).get();
    const data = this.extract(snapshot);

    return data;
  }
  async updateVideo(docId: string, newVideoUrl: string, newExpiration: number) {
    const p1 = this.doc(docId).update('recording.videoUrl', newVideoUrl);
    const p2 = this.doc(docId).update(
      'recording.linkExpiration',
      newExpiration
    );

    await Promise.all([p1, p2]);

    const newData = await this.doc(docId).get();
    const data = newData.data();

    if (data === undefined) {
      throw new BadRequestException('Recording ID not in database');
    }

    return data;
  }

  async updateVideoCompressed(
    docId: string,
    newVideoUrl: string,
    newExpiration: number
  ) {
    const p1 = this.doc(docId).update('recording.videoUrl', newVideoUrl);
    const p2 = this.doc(docId).update('recording.compressed', true);
    const p3 = this.doc(docId).update(
      'recording.linkExpiration',
      newExpiration
    );

    await Promise.all([p1, p2, p3]);
  }

  async countRequestSendLink(clientId: string) {
    const snapshot = await this.where('clientId', '==', clientId)
      .get();
    return this.extract(snapshot);
  }

}
