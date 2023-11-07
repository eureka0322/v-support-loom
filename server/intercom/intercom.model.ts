export class IntercomModel {
  workspaceId: string;
  accessToken: string;

  constructor(workspaceId: string, accessToken: string) {
    this.workspaceId = workspaceId;
    this.accessToken = accessToken;
  }
}

export const collection = 'intercom-v2';

export const converter: FirebaseFirestore.FirestoreDataConverter<IntercomModel> =
  {
    toFirestore(user: IntercomModel): FirebaseFirestore.DocumentData {
      return {
        workspaceId: user.workspaceId,
        accessToken: user.accessToken,
      };
    },

    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
      const { workspaceId, accessToken } = snapshot.data();

      return new IntercomModel(workspaceId, accessToken);
    },
  };
