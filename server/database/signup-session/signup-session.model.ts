export class SignupSession {
  expiration: number;
  usages: number;

  constructor(expiration: number, usages: number) {
    this.expiration = expiration;
    this.usages = usages;
  }
}

export const collection = 'signup-session';

export const converter: FirebaseFirestore.FirestoreDataConverter<SignupSession> =
  {
    toFirestore(signupSession: SignupSession): FirebaseFirestore.DocumentData {
      return {
        expiration: signupSession.expiration,
        usages: signupSession.usages,
      };
    },

    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
      const { expiration, usages } = snapshot.data();

      return new SignupSession(expiration, usages);
    },
  };
