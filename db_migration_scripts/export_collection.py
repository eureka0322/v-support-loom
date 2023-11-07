import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import json


def write_recordings(db, collection_name):
    recordings = db.collection(collection_name)
    with open(f"{collection_name}.json", "r") as f:
        recs = json.load(f)
    for rec in recs:
        recordings.document(rec["id"]).set(rec["data"])


def main():
    collection_name = "pricing"
    cred = credentials.Certificate("./account.staging.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    write_recordings(db, collection_name)


if __name__ == "__main__":
    main()
