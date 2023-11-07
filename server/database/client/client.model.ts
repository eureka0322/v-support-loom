export class Client {
  id: string;
  name: string;
  settings: Record<string, any>;
  pricingPlan: string;
  recordingAmount: number;
  createdAt: Date;
  subscription: string;

  constructor(
    id: string,
    name: string,
    settings: Record<string, any>,
    pricingPlan: string,
    recordingAmount: number,
    createdAt: Date,
    subscription: string
  ) {
    this.id = id;
    this.name = name;
    this.settings = settings;
    this.pricingPlan = pricingPlan;
    this.recordingAmount = recordingAmount;
    this.createdAt = createdAt;
    this.subscription = subscription;
  }
}

export const collection = 'clients-v2';

export const converter: FirebaseFirestore.FirestoreDataConverter<Client> = {
  toFirestore(client: Client): FirebaseFirestore.DocumentData {
    return {
      id: client.id,
      name: client.name,
      settings: client.settings,
      pricingPlan: client.pricingPlan,
      recordingAmount: client.recordingAmount,
      createdAt: client.createdAt,
      subscription: client.subscription,
    };
  },

  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
    const {
      id,
      name,
      settings,
      pricingPlan,
      recordingAmount,
      createdAt,
      subscription,
    } = snapshot.data();

    return new Client(
      id,
      name,
      settings,
      pricingPlan,
      recordingAmount,
      createdAt,
      subscription
    );
  },
};
