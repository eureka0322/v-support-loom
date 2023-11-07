import { getHeapSnapshot } from 'v8';
import { CreateLinkRecordDto } from '../dtos/create-link-record.dto';

export class ApiLink extends CreateLinkRecordDto {}

export const collection = 'api-links';

export const converter: FirebaseFirestore.FirestoreDataConverter<ApiLink> = {
  toFirestore(apiLink: ApiLink) {
    return Object.assign({}, apiLink);
  },
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): ApiLink {
    return Object.assign({}, snapshot.data()) as ApiLink;
  },
};
