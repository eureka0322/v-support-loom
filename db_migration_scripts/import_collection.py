import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import json


def get_recordings(db, collection_name):
    recs = db.collection(collection_name).get()
    recs = list(map(lambda x: {"id": x.id, "data": x.to_dict()}, recs))
    with open(f"{collection_name}.json", "w") as f:
        json.dump(recs, f, default=str)


def main():
    collection_name = "pricing"
    cred = credentials.Certificate("./account.prod.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    get_recordings(db, collection_name)


if __name__ == "__main__":
    main()
