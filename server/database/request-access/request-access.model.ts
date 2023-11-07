export class RequestAccess {
  createdAt: number;
  email: string;

  constructor(createdAd: number, email: string) {
    this.createdAt = createdAd;
    this.email = email;
  }
}

export const collection = 'request-access';

export const converter: FirebaseFirestore.FirestoreDataConverter<RequestAccess> =
  {
    toFirestore(access: RequestAccess): FirebaseFirestore.DocumentData {
      return {
        createdAt: access.createdAt,
        email: access.email,
      };
    },

    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
      const { createdAt, email } = snapshot.data();

      return new RequestAccess(createdAt, email);
    },
  };
