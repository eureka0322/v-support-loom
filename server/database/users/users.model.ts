export class User {
  id: string;
  name: string;
  email: string;
  photo: string;
  organizationId: string;
  organizationRole: string;
  hasSeat: boolean;
  hashedPassword?: string;
  crisp_client_id?: string;

  constructor(
    id: string,
    name: string,
    email: string,
    photo: string,
    organizationId: string,
    organizationRole: string,
    hasSeat: boolean,
    hashedPassword?: string,
    crisp_client_id?: string
  ) {
    this.id = id;
    this.name = name;
    // Keep email always in lowercase
    this.email = email.toLowerCase();
    this.photo = photo;
    this.organizationId = organizationId;
    this.organizationRole = organizationRole;
    this.hasSeat = hasSeat;
    this.hashedPassword = hashedPassword;
    this.crisp_client_id = crisp_client_id;
  }
}

export const collection = 'users-v2';

export const converter: FirebaseFirestore.FirestoreDataConverter<User> = {
  toFirestore(user: User): FirebaseFirestore.DocumentData {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      organizationId: user.organizationId,
      organizationRole: user.organizationRole,
      hasSeat: user.hasSeat,
      hashedPassword: user.hashedPassword,
      crisp_client_id: user.crisp_client_id,
    };
  },

  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
    const {
      id,
      name,
      email,
      photo,
      organizationId,
      organizationRole,
      hasSeat,
      hashedPassword,
      crisp_client_id,
    } = snapshot.data();

    return new User(
      id,
      name,
      email,
      photo,
      organizationId,
      organizationRole,
      hasSeat,
      hashedPassword,
      crisp_client_id
    );
  },
};
