export class Button {
  email: string;
  workspaceId: string;
  createdAt: number;

  constructor(email: string, workspaceId: string, createdAt: number) {
    this.email = email;
    this.workspaceId = workspaceId;
    this.createdAt = createdAt;
  }
}

export const collection = 'button';

export const converter: FirebaseFirestore.FirestoreDataConverter<Button> = {
  toFirestore(button: Button): FirebaseFirestore.DocumentData {
    return {
      email: button.email,
      workspace_id: button.workspaceId,
      createdAt: button.createdAt,
    };
  },

  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
    const { email, workspace_id, createdAt } = snapshot.data();

    return new Button(email, workspace_id, createdAt);
  },
};
