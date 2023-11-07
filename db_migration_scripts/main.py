import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

from uuid import uuid4
from time import sleep


def create_client(old_client):
    new_client = {
        "id": str(uuid4()),
        "name": old_client["name"],
        "pricingPlan": old_client["pricing_plan"],
        "recordingAmount": old_client["recording_amount"],
        "settings": {
            "app": {
                "branding": old_client["settings"]["app"]["branding"],
                "referrerUrl": old_client["settings"]["app"]["referrer_url"],
            },
            "seats": old_client["settings"]["seats"]["amount"],
            "integrations": {},
        },
        "v2": True,
    }
    if (
        "intercom" in old_client["settings"]
        and old_client["settings"]["intercom"]["workspace_id"] != ""
    ):
        new_client["settings"]["integrations"]["intercom"] = {
            "workspaceId": old_client["settings"]["intercom"]["workspace_id"]
        }
    if (
        "zendesk" in old_client["settings"]
        and old_client["settings"]["zendesk"]["subdomain"] != ""
    ):
        new_client["settings"]["integrations"]["zendesk"] = {
            "subdomain": old_client["settings"]["zendesk"]["subdomain"]
        }
    return new_client


def update_clients(db):
    collection = db.collection("clients")
    new_collection = db.collection("clients-v2")
    clients = collection.get()
    total = 0
    for client in clients:
        data = client.to_dict()
        if "v2" not in data:
            new_client = create_client(data)
            new_collection.document(new_client["id"]).set(new_client)
            collection.document(client.id).update({"newId": new_client["id"]})
        total += 1
    print(f"Client migrated: {total}")


def find_matching_client(db, old_user, docref):
    uid = old_user["id"]
    clients = db.collection("clients")
    client = clients.where("user_id", "==", uid).get()
    if len(client) == 0:
        return None
    elif len(client) > 1:
        raise ValueError("more than one client per user")
    else:
        client = client[0]
        assert client.to_dict()["user_doc_ref"] == docref
        return client.to_dict()


def create_user(db, old_user, docref):
    matching_client = find_matching_client(db, old_user, docref)
    if "photo" in old_user:
        photo = old_user["photo"]
    else:
        photo = ""
    if matching_client is not None:
        new_user = {
            "email": old_user["email"],
            "hasSeat": True,
            "id": str(uuid4()),
            "name": old_user["name"],
            "organizationId": matching_client["newId"],
            "organizationRole": "admin",
            "photo": photo,
        }
        return new_user
    else:
        return None


def update_users(db):
    collection = db.collection("users")
    new_users = db.collection("users-v2")
    users = collection.get()
    total = 0
    for user in users:
        data = user.to_dict()
        if "v2" not in data:
            new_user = create_user(db, data, user.id)
            if new_user is not None:
                new_users.document(new_user["id"]).set(new_user)
            total += 1
    print(f"Users migrated: {total}")


def find_intercom_client(db, workspace_id):
    clients = (
        db.collection("clients-v2")
        .where("settings.integrations.intercom.workspaceId", "==", workspace_id)
        .get()
    )
    if len(clients) == 1:
        return clients[0].to_dict()
    elif len(clients) == 0:
        # error here
        print(f"Can't find intercom client: {workspace_id}")
    else:
        print(f"Found too many intercom clients: {workspace_id}")
    return None


def find_zendesk_client(db, subdomain):
    clients = (
        db.collection("clients-v2")
        .where("settings.integrations.zendesk.subdomain", "==", subdomain)
        .get()
    )
    if len(clients) == 1:
        return clients[0].to_dict()
    elif len(clients) == 0:
        print(f"Can't find zendesk client: {subdomain}")
    else:
        print(f"Found too many zendesk clients: {subdomain}")
    return None


def find_web_client(db, widget_id):
    clients = (
        db.collection("clients-v2")
        .where("settings.integrations.web.widget_id", "==", widget_id)
        .get()
    )
    if len(clients) == 1:
        return clients[0].to_dict()
    elif len(clients) == 0:
        print(f"Can't find web client: {widget_id}")
    else:
        print(f"Found too many web clients: {widget_id}")
    return None


def find_recording_client(db, recording):
    if "intercom" in recording and "workspaceId" in recording["intercom"]:
        return find_intercom_client(db, recording["intercom"]["workspaceId"])
    elif "zendesk" in recording and "subdomain" in recording["zendesk"]:
        return find_zendesk_client(db, recording["zendesk"]["subdomain"])
    elif "web" in recording:
        if "widget_id" in recording["web"]:
            return find_web_client(db, recording["web"]["widget_id"])
        elif "widgetId" in recording["web"]:
            return find_web_client(db, recording["web"]["widgetId"])
    else:
        print(f"Recording doesn't have any client: {recording}")
    return None


def data_to_metadata(data):
    customer_data = {}
    metadata = {}
    for elem in data:
        if elem["type"] == "customer":
            where_to_put = customer_data
        elif elem["type"] == "product":
            where_to_put = metadata
        else:
            raise ValueError
        for item in elem["items"]:
            if "text" in item:
                where_to_put[item["headline"]] = item["text"]
            elif "url" in item:
                where_to_put[item["headline"]] = item["url"]
            else:
                print(item)
                raise ValueError

    return metadata, customer_data


def get_reserved_metadata(recording):
    reserved_metadata = {}
    admin_data = {}
    if "intercom" in recording and "workspaceId" in recording["intercom"]:
        intercom = recording["intercom"]
        if "conversationId" in intercom:
            reserved_metadata["intercomConversationId"] = intercom["conversationId"]
        if "contactId" in intercom:
            reserved_metadata["intercomContactId"] = intercom["contactId"]
        if "admin" in intercom:
            admin_data = intercom["admin"]
    return reserved_metadata, admin_data


def create_recording(db, recording, docref):
    client = find_recording_client(db, recording)
    if client is None:
        return None
    metadata, customer_data = data_to_metadata(recording["data"])
    reserved_metadata, admin_data = get_reserved_metadata(recording)
    new_recording = {
        "clientId": client["id"],
        "requester": admin_data,
        "customer": customer_data,
        "device": recording["device"],
        "recording": recording["recording"],
        "metadata": metadata,
        "reservedMetadata": reserved_metadata,
        "id": docref,
    }
    return new_recording


def update_recordings(db):
    collection = db.collection("recordings")
    recordings = collection.get()
    total = 0
    len_ = 0
    batch = db.batch()
    batch_size = 0
    for recording in recordings:
        len_ += 1
        print("============")
        data = recording.to_dict()
        if "v2" not in data:
            new_recording = create_recording(db, data, recording.id)
            if new_recording is not None:
                ref = db.collection("recordings-v2").document(recording.id)
                batch.set(ref, new_recording)
                batch_size += 1
                total += 1
                if batch_size == 499:
                    print("Committing and sleeping...")
                    sleep(20)
                    batch.commit()
                    batch_size = 0
                    batch = db.batch()
            else:
                print(f"Failed to add client")
    print("Committing and sleeping...")
    sleep(20)
    batch.commit()
    print(f"Recording records updated: {total}/{len_}")


def user_already_exists(db, email):
    users = db.collection("users-v2").where("email", "==", email).get()
    return len(users) > 0


def create_user_from_intercom(db, data):
    client = find_intercom_client(db, data["workspaceId"])
    if client is None:
        print(f"Can't find client from intercom: {data}")
        return None
    if user_already_exists(db, data["email"]):
        return None
    if "has_videosupport_seat" in data:
        has_seat = data["has_videosupport_seat"]
    elif "has_inbox_seat" in data:
        has_seat = data["has_inbox_seat"]
    else:
        print(f"hasSeat assumed false for data: {data}")
        has_seat = False
    if data["email"] == f'operator+{data["workspaceId"]}@intercom.io':
        has_seat = True
    new_user = {
        "name": data["name"],
        "email": data["email"],
        "id": str(uuid4()),
        "hasSeat": has_seat,
        "organizationRole": "member",
        "photo": "",
        "organizationId": client["id"],
    }
    return new_user


def update_intercom_users(db):
    put_in = db.collection("users-v2")
    collection = db.collection("intercom")
    intercom = collection.get()
    total = 0
    len_ = 0
    for i in intercom:
        len_ += 1
        data = i.to_dict()
        new_user = create_user_from_intercom(db, data)
        if new_user is not None:
            put_in.document(new_user["id"]).set(new_user)
            total += 1
    print(f"Created {total} users from intercom (out of {len_})")


def get_intercom_token(db, client):
    if "intercom" not in client["settings"]["integrations"]:
        return None
    intercom = client["settings"]["integrations"]["intercom"]
    if "workspaceId" not in intercom:
        return None
    workspace_id = intercom["workspaceId"]
    intercom = db.collection("intercom").where("workspaceId", "==", workspace_id).get()
    if len(intercom) == 0:
        print(f"Can't find intercom: {client}")
        return None
    else:
        return workspace_id, intercom[0].to_dict()["accessToken"]


def update_intercom_tokens(db):
    clients = db.collection("clients-v2").get()
    new_intercom = db.collection("intercom-v2")
    for client in clients:
        data = client.to_dict()
        res = get_intercom_token(db, data)
        if res is not None:
            workspace, token = res
            new_intercom.document(workspace).set(
                {
                    "accessToken": token,
                    "workspaceId": workspace,
                }
            )


def main():
    #########
    # CAREFUL
    #########
    cred = credentials.Certificate("./account.staging.json")
    firebase_admin.initialize_app(cred)
    ### A failsafe in case someone runs this by accident
    input(
        "You're about to migrate the production database. Press Ctrl+C to leave, or enter to continue"
    )
    db = firestore.client()
    # update_clients(db)
    # update_users(db)
    # update_recordings(db)
    # update_intercom_users(db)
    # update_intercom_tokens(db)


if __name__ == "__main__":
    main()


"""
ICP: 
- form-based support
- more specific amount than 'expensive'
- also about pmf

apicbase: 
food company with point-of-sale
core of icp: they need point of sales,
if they don't have point of sales, the stickness 
is too low

why would they need it? because they have a form, etc
then that's your icp
the icp someone having a form
if that same company comes with phone support, etc, then
it's a no

first and second line support

have conversation
"I'm building something, I don't want to sell anything 
because it's not sellable today, do you mind asking me 
some questions?"

maybe it's the plant company that needs videosupport

listen summarize dig-deeper

sales technique: 
being authentic
extremely interested in the other person's thoughts

plants: very good business segments

small/medium: talk with founder / less than 30 people
big companies: team lead for customer success (call customer success) 

ticket-based support is not 21st century
more fluid -> more like an intercom approach

"how to translate customer problems into solutions?"

the board needs to bring the next investor on board

-> why do your customers send videos?

"""
