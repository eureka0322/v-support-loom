import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

from uuid import uuid4
import time


def create_subscriptions(db):
    collection = db.collection("subscriptions")
    clients_doc = db.collection("clients-v2")
    clients = clients_doc.get()
    total = 0
    for client in clients:
        uid = client.id
        new_subscription_id = str(uuid4())
        new_subscription = {
            "subscriptionType": "trial",
            "subscriptionStart": int(time.time() * 1000),
            "subscriptionEnd": int(time.time() * 1000) + 1209600000,
            "pastBillings": [],
        }
        collection.document(new_subscription_id).set(new_subscription)
        clients_doc.document(uid).update({"subscription": new_subscription_id})
        total += 1
    print(f"{total} updated")


def check_zenyum_users(db):
    uid = "faf30c96-d046-416f-ace7-0c77b0e0c0db"
    collection = db.collection("users-v2").where("organizationId", "==", uid).get()
    onemore = 0
    total = 0
    for user in collection:
        data = user.to_dict()
        if data["hasSeat"]:
            onemore += 1
        total += 1
    print(f"Seats: {onemore} out of {total}")


def main():
    #########
    # CAREFUL
    #########
    cred = credentials.Certificate("./account.staging.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    ### Failsafe if someone runs by accident
    input(
        "You're about to migrate the production database. Press Ctrl+C to leave, or enter to continue"
    )
    create_subscriptions(db)
    # check_zenyum_users(db)


if __name__ == "__main__":
    main()
