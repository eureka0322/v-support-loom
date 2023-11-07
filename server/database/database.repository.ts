import { Injectable } from '@nestjs/common';

import { DatabaseConnection } from './database.connection';

// Create a shorter type name for ease of use.
type CollRef<T> = FirebaseFirestore.CollectionReference<T>;
type DocRef<T> = FirebaseFirestore.DocumentReference<T>;
@Injectable()
export class DatabaseRepository<T> {
  collection: string | undefined;
  document: string | undefined;
  converter: FirebaseFirestore.FirestoreDataConverter<T> | undefined;

  constructor(private readonly databaseConnection: DatabaseConnection) {}

  private coll() {
    if (!this.collection) {
      throw new Error(
        "Use 'setCollection' and 'setConverter' before calling 'coll'."
      );
    }

    const collectionRef = this.databaseConnection.db.collection(
      this.collection
    );

    if (this.converter) {
      return collectionRef.withConverter(this.converter);
    }

    return collectionRef as FirebaseFirestore.CollectionReference<T>; /* <T> -> Type Argument */
  }

  runTransaction(
    updateFunction: (
      transaction: FirebaseFirestore.Transaction
    ) => Promise<unknown>
  ) {
    return this.databaseConnection.db.runTransaction(updateFunction);
  }
  extract(snapshot: FirebaseFirestore.QuerySnapshot<T>) {
    return snapshot.docs.map((doc) => ({
      docRef: doc.id,
      data: doc.data(),
    }));
  }

  extractOne(snapshot: FirebaseFirestore.QuerySnapshot<T>) {
    if (snapshot.empty) return undefined;

    return {
      docRef: snapshot.docs[0].id,
      data: snapshot.docs[0].data(),
    };
  }

  // The following methods are proxies to the firestore connection.
  // They are identical to calling `this.coll().<method>`.
  // This is for convenience so we can drop `.coll()`.
  get(...args: Parameters<CollRef<T>['get']>) {
    return this.coll().get(...args);
  }

  add(...args: Parameters<CollRef<T>['add']>) {
    return this.coll().add(...args);
  }

  where(...args: Parameters<CollRef<T>['where']>) {
    return this.coll().where(...args);
  }

  order(...args: Parameters<CollRef<T>['orderBy']>) {
    return this.coll().orderBy(...args);
  }

  doc(...args: Parameters<CollRef<T>['doc']>) {
    return this.coll().doc(...args);
  }

  update(docRef: string, ...args: Parameters<DocRef<T>['update']>) {
    return this.coll()
      .doc(docRef)
      .update(...args);
  }
}
