export class Recording {
  id: string;
  clientId?: string;
  linkId?: string;
  currentDate?: any;
  recording: Record<string, any>;
  device: Record<string, any>;
  metadata?: Record<string, string | number | boolean>;
  reservedMetadata?: Record<string, string | number | boolean>;
  customer?: Record<string, string | number | boolean>;
  requester?: Record<string, string | number | boolean>;
  assigned?: Record<string, string | number | boolean>;

  constructor(
    id: string,
    clientId: string | undefined,
    linkId: string | undefined,
    currentDate: any,
    recording: Record<string, any>,
    device: Record<string, any>,
    metadata?: Record<string, string | number | boolean>,
    reservedMetadata?: Record<string, string | number | boolean>,
    customer?: Record<string, string | number | boolean>,
    requester?: Record<string, string | number | boolean>,
    assigned?: Record<string, string | number | boolean>
  ) {
    this.id = id;
    this.clientId = clientId;
    this.linkId = linkId;
    this.currentDate = currentDate;
    this.recording = recording;
    this.device = device;
    this.metadata = metadata;
    this.reservedMetadata = reservedMetadata;
    this.customer = customer;
    this.requester = requester;
    this.assigned = assigned;
  }
}

export const collection = 'recordings-v2';

export const converter: FirebaseFirestore.FirestoreDataConverter<Recording> = {
  toFirestore(recording: Recording): FirebaseFirestore.DocumentData {
    return {
      id: recording.id,
      clientId: recording.clientId,
      linkId: recording.linkId,
      currentDate: recording.currentDate,
      metadata: recording.metadata,
      reservedMetadata: recording.reservedMetadata,
      customer: recording.customer,
      requester: recording.requester,
      recording: recording.recording,
      device: recording.device,
      assigned: recording.assigned,
    };
  },

  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
    const {
      id,
      clientId,
      linkId,
      currentDate,
      recording,
      device,
      metadata,
      reservedMetadata,
      customer,
      requester,
      assigned,
    } = snapshot.data();

    return new Recording(
      id,
      clientId,
      linkId,
      currentDate,
      recording,
      device,
      metadata,
      reservedMetadata,
      customer,
      requester,
      assigned
    );
  },
};
