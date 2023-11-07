import admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '../config/config.service';

@Injectable()
export class DatabaseConnection {
  public readonly db: FirebaseFirestore.Firestore;
  public readonly storage: admin.storage.Storage;

  constructor(private readonly configService: ConfigService) {
    const serviceAccountString = this.configService.getString(
      'GCP_SERVICE_ACCOUNT'
    );

    if (!serviceAccountString) {
      throw new Error(
        "The 'GCP_SERVICE_ACCOUNT' variable was not found in the configuration."
      );
    }

    let serviceAccount: Record<string, any>;
    try {
      serviceAccount = JSON.parse(serviceAccountString);
    } catch (err) {
      throw new Error(
        'Could not read the service account key for the database connection.'
      );
    }

    // During unit testing, just initiate one firebase app to use for all tests
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      this.db = admin.firestore();
      this.db.settings({
        ignoreUndefinedProperties: true,
      });
    } else {
      admin.app();
      this.db = admin.firestore();
    }
  }
}
