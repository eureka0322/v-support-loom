export class HubspotContact {
  constructor(
    public readonly email: string,
    public readonly recordings: string[],
  ) {}
}

export class HubspotModel {
  constructor(
    public accountId: number,
    public accessToken: string,
    public refreshToken: string,
    public tokenExpiration: number,
    public ownerEmails: string[],
    public contacts: HubspotContact[],
  ) {}
}

export const collection = 'hubspot';

export const converter: FirebaseFirestore.FirestoreDataConverter<HubspotModel> =
  {
    toFirestore(model: HubspotModel): FirebaseFirestore.DocumentData {
      return {
        accountId: model.accountId,
        access_token: model.accessToken,
        refresh_token: model.refreshToken,
        token_expiration: model.tokenExpiration,
        owner_emails: model.ownerEmails,
        contacts: model.contacts.map((contact) => {
          return {
            email: contact.email,
            recordings: contact.recordings,
          };
        }),
      };
    },

    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
      const {
        accountId,
        accessToken,
        refreshToken,
        tokenExpiration,
        ownerEmails,
        contacts,
      } = snapshot.data();

      return new HubspotModel(
        accountId,
        accessToken,
        refreshToken,
        tokenExpiration,
        ownerEmails,
        contacts.map((contact: { email: string; recordings: string[] }) => {
          return new HubspotContact(contact.email, contact.recordings);
        }),
      );
    },
  };
