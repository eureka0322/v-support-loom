export class PotentialUser {
  id: string;
  name: string;
  email: string;
  workspaceId: string;

  constructor(id: string, name: string, email: string, workspaceId: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.workspaceId = workspaceId;
  }
}

export const collection = 'emails';

export const converter: FirebaseFirestore.FirestoreDataConverter<PotentialUser> =
  {
    toFirestore(user: PotentialUser): FirebaseFirestore.DocumentData {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        workspace_id: user.workspaceId,
      };
    },

    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
      const { id, name, email, workspace_id } = snapshot.data();

      return new PotentialUser(id, name, email, workspace_id);
    },
  };
