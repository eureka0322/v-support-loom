export class SubscriptionTypeModel {
  constructor(
    public name: string,
    public stripeProductId?: string,
    public pricePerSeat?: number,
    public expires?: number,
    public upsell?: string,
    public subscriptionKey?: string
  ) {}
}

export class SubscriptionModel {
  subscriptionType: string;
  subscriptionDisplayName?: string;
  subscriptionStart?: number;
  subscriptionEnd?: number;
  paidSeats?: number;
  freeSeats?: number;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;

  constructor(
    subscriptionType: string,
    subscriptionDisplayName?: string,
    subscriptionStart?: number,
    subscriptionEnd?: number,
    paidSeats?: number,
    freeSeats?: number,
    stripeSubscriptionId?: string,
    stripeCustomerId?: string
  ) {
    this.subscriptionStart = subscriptionStart;
    this.subscriptionType = subscriptionType;
    this.subscriptionDisplayName = subscriptionDisplayName;
    this.subscriptionEnd = subscriptionEnd;
    this.paidSeats = paidSeats;
    this.freeSeats = freeSeats;
    this.stripeSubscriptionId = stripeSubscriptionId;
    this.stripeCustomerId = stripeCustomerId;
  }
}

export const collection = 'subscriptions';
export const converter: FirebaseFirestore.FirestoreDataConverter<SubscriptionModel> =
  {
    toFirestore(model: SubscriptionModel): FirebaseFirestore.DocumentData {
      return {
        subscriptionType: model.subscriptionType,
        subscriptionDisplayName: model.subscriptionDisplayName,
        subscriptionStart: model.subscriptionStart,
        subscriptionEnd: model.subscriptionEnd,
        paidSeats: model.paidSeats, 
        freeSeats: model.freeSeats,
        stripeSubscriptionId: model.stripeSubscriptionId,
        stripeCustomerId: model.stripeCustomerId,
      };
    },

    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
      const {
        subscriptionStart,
        subscriptionType,
        subscriptionDisplayName,
        subscriptionEnd,
        paidSeats,
        freeSeats,
        stripeSubscriptionId,
        stripeCustomerId,
      } = snapshot.data();

      return new SubscriptionModel(
        subscriptionType,
        subscriptionDisplayName,
        subscriptionStart,
        subscriptionEnd,
        paidSeats,
        freeSeats,
        stripeSubscriptionId,
        stripeCustomerId
      );
    },
  };

export const typeCollection = 'subscription-types';
export const typeConverter: FirebaseFirestore.FirestoreDataConverter<SubscriptionTypeModel> =
  {
    toFirestore(model: SubscriptionTypeModel): FirebaseFirestore.DocumentData {
      return {
        name: model.name,
        stripeProductId: model.stripeProductId,
        pricePerSeat: model.pricePerSeat,
        expires: model.expires,
        upsell: model.upsell,
        subscriptionKey: model.subscriptionKey,
      };
    },

    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
      const {
        name,
        stripeProductId,
        pricePerSeat,
        expires,
        upsell,
        subscriptionKey,
      } = snapshot.data();

      return new SubscriptionTypeModel(
        name,
        stripeProductId,
        pricePerSeat,
        expires,
        upsell,
        subscriptionKey
      );
    },
  };
