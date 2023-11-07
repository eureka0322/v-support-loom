export class Workspace {
  workspaces: string[];

  constructor(workspaces: string[]) {
    this.workspaces = workspaces;
  }
}

export const collection = 'beta';

export const converter: FirebaseFirestore.FirestoreDataConverter<Workspace> = {
  toFirestore(workspace: Workspace): FirebaseFirestore.DocumentData {
    return {
      workspaces: workspace.workspaces,
    };
  },

  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
    const { workspaces } = snapshot.data();

    return new Workspace(workspaces);
  },
};
