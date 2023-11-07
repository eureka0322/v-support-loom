import os
from slack_bolt import App
from slack_bolt.oauth.oauth_settings import OAuthSettings
from slack_sdk.oauth.installation_store import FileInstallationStore
from slack_sdk.oauth.installation_store.models.installation import Installation
from slack_sdk.oauth.state_store import OAuthStateStore
from slack_sdk.oauth.installation_store.models.installation import (
    Installation as SlackInstallation,
)

from dotenv import load_dotenv
import requests
import jwt
import firebase_admin as firebase
from firebase_admin import firestore
from datetime import datetime
import json
import time
from uuid import uuid4
from typing import Optional
from flask import Flask, request, redirect
from slack_bolt.adapter.flask import SlackRequestHandler
from waitress import serve

load_dotenv()

JWT_SECRET = os.environ.get("JWT_SECRET")
APP_URL = os.environ.get("APP_URL")
GCP_SERVICE_ACCOUNT = os.environ.get("GCP_SERVICE_ACCOUNT")
STATE_EXPIRATION = int(os.environ.get("STATE_EXPIRATION"))
_cred_json = json.loads(GCP_SERVICE_ACCOUNT)
_firestore_credentials = firebase.credentials.Certificate(_cred_json)
firebase.initialize_app(_firestore_credentials)
DB = firestore.client()
CLIENTS_COLLECTION = "clients-v2"
SLACK_COLLECTION = 'slack'
SLACK_STATE_COLLECTION = 'slack-states'
VIDEOSUPPORT_SLASH_CMD = os.environ.get("VIDEOSUPPORT_SLASH_CMD")
PORT = os.environ.get("PORT")


class CustomInstallationStore:
    def save(self, installation: SlackInstallation):
        install_url = base_url("slack/install")
        client_id = str(uuid4())
        requests.post(
            install_url,
            headers={"Authorization": f"Bearer {sign_jwt(client_id)}"},
            json=installation.__dict__,
        )

    def find_installation(
        self,
        *,
        enterprise_id: Optional[str],
        team_id: Optional[str],
        user_id: Optional[str] = None,
        is_enterprise_install: Optional[bool] = False,
    ):
        if team_id:
            key_term = 'team_id'
            search_term = team_id
        elif enterprise_id:
            key_term = 'enterprise_id'
            search_term = enterprise_id
        elif user_id:
            key_term = 'user_id'
            search_term = user_id
        else:
            return None
        res = DB.collection(SLACK_COLLECTION).where(key_term, '==', search_term).get()
        if len(res) == 1:
            return Installation(**res[0].to_dict())
        else:
            return None


class CustomStateStore(OAuthStateStore):
    def __init__(self, expiration_seconds: int) -> None:
        super().__init__()
        self.expiration_seconds = expiration_seconds

    def issue(self, *args, **kwargs):
        state = str(uuid4())
        DB.collection(SLACK_STATE_COLLECTION).document(state).set({
            "expiration": int(time.time()) + self.expiration_seconds
        })
        return state

    def consume(self, state: str):
        st = DB.collection(SLACK_STATE_COLLECTION).document(state).get()
        if st and st.to_dict()['expiration'] > int(time.time()):
            return True
        return False



oauth_settings = OAuthSettings(
    client_id=os.environ.get("SLACK_CLIENT_ID"),
    client_secret=os.environ.get("SLACK_CLIENT_SECRET"),
    scopes=[
        "channels:read",
        "channels:history",
        "chat:write",
        "commands",
        "groups:history",
        "groups:read",
        "im:history",
        "mpim:history",
        "mpim:read",
        "im:read",
        "users.profile:read",
        "users:read",
        "users:read.email",
        "channels:join"
    ],
    installation_store=CustomInstallationStore(),
    state_store=CustomStateStore(expiration_seconds=STATE_EXPIRATION),
)

app = App(
    signing_secret=os.environ.get("SLACK_SIGNING_SECRET"),
    oauth_settings=oauth_settings,
)



def sign_jwt(client_id):
    payload = {"clientId": client_id, "role": "slack_app"}
    secret = JWT_SECRET
    return jwt.encode(payload, secret)


def vs_unassigned_videos(client_id, user_email):
    request_url = base_url("api/videos/unassigned")

    res = requests.post(
        request_url,
        headers={"Authorization": f"Bearer {sign_jwt(client_id)}"},
        json={"agentEmail": user_email},
    )
    as_json = json.loads(res.text)
    return as_json["results"]


def vs_your_videos(client_id, slack_user_id, user_email):
    request_url = base_url("api/videos/match")
    res = requests.post(
        request_url,
        headers={
            "Authorization": f"Bearer {sign_jwt(client_id)}",
        },
        json={
            "agentEmail": user_email,
            "match": {"reservedMetadata.slackUserId": slack_user_id},
        },
    )
    as_json = json.loads(res.text)
    return as_json["results"]


<<<<<<< HEAD
def find_client_videos(client_id, slack_user_id, user_email):
=======
def find_client_id(slack_team_id):
    client = (
        DB.collection(CLIENTS_COLLECTION)
        .where("settings.integrations.slack.teamId", "==", slack_team_id)
        .get()
    )
    if len(client) != 1:
        raise ValueError("Client ID not found")
    return client[0].id


def find_client_videos(slack_team_id, slack_user_id, user_email):
    client_id = find_client_id(slack_team_id)
>>>>>>> 01e1a72 (layout(v2): new layout)
    unassigned_videos = vs_unassigned_videos(client_id, user_email)
    your_videos = vs_your_videos(client_id, slack_user_id, user_email)
    res = {
        "unassigned": unassigned_videos,
        "your-videos": your_videos,
    }
    return res


def format_videos(videos):
    def fmt_video(video):
        unix_date = video["recording"]["recordedAt"]
        ms_per_sec = 1000
        requested_by = ""
        if "name" in video["requester"].keys():
            requested_by = f"*Requested by*: {video['requester']['name']}\n"
        elif "email" in video["requester"].keys():
            requested_by = f"*Requested by*: {video['requester']['email']}\n"
        customer = ""
        if "email" in video["customer"].keys():
            customer = f"*Customer*: {video['customer']['email']}\n"
        elif "name" in video["customer"].keys():
            customer = f"*Customer*: {video['customer']['name']}\n"
        message = ""
        if video["recording"]["message"] != "":
            message = f"*Customer note*: {video['recording']['message']}"
        date = datetime.utcfromtimestamp(unix_date // ms_per_sec).strftime(
            "%Y-%m-%d %H:%M:%S"
        )
        additional_info = ""
        if requested_by == "" and customer == "" and message == "":
            additional_info = "No information to show"
        video_url = video["watchUrl"]
        return {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"<{video_url}|*{date}*>\n{requested_by}{customer}{message}{additional_info}",
            },
            "accessory": {
                "type": "image",
                "image_url": video["recording"]["thumbnailUrl"],
                "alt_text": "alt text for image",
            },
        }

    return list(map(fmt_video, videos))


def vs_app_url():
    return APP_URL


def base_url(path=""):
    if path == "":
        return vs_app_url
    elif path[0] == "/":
        return f"{vs_app_url()}{path}"
    else:
        return f"{vs_app_url()}/{path}"


def vs_request_link(client_id, user_id, **kwargs):
    request_url = base_url("api/create/link")

    res = requests.post(
        request_url,
        headers={"Authorization": f"Bearer {sign_jwt(client_id)}"},
        json={
            "options": {
                "tinyUrl": "true",
            },
            "postRecordHooks": [
                {
                    "name": "Send message to Slack",
                    "url": base_url(f"slack/message-video/"),
                }
            ],
            "reservedMetadata": {
                "slackUserId": user_id,
            },
            **kwargs,
        },
    )
    return res.text


@app.event("app_home_opened")
<<<<<<< HEAD
def app_home_opened(body, client, ack):
=======
def app_home_opened(body, logger, client, ack):
>>>>>>> 01e1a72 (layout(v2): new layout)
    ack()
    event = body["event"]
    if event["tab"] == "home":
        user_id = event["user"]
        profile = client.users_profile_get(user=user_id)["profile"]
        team_id = body["team_id"]
<<<<<<< HEAD
        client_id = client_id_from_team_id(team_id)
        if client_id is None:
            return
        welcome_block = [{
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Hello! :wave:\n\nWelcome to Videosupport! *We let your customer show, not tell*.\n\nEasily generate a link to share with your customers, for them to record a video that you will receive here in Slack. Just type */videosupport* to get started!",
            }
        }, {
            "type": "divider",
        }]
        authorized = check_client_authorized(client_id)
        videos = find_client_videos(client_id, user_id, profile["email"])
=======
        videos = find_client_videos(team_id, user_id, profile["email"])
>>>>>>> 01e1a72 (layout(v2): new layout)
        unassigned = format_videos(videos["unassigned"])
        your_videos = format_videos(videos["your-videos"])
        no_videos_to_watch = [{
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": "No videos to watch at this time",
                },

        }]
        if len(unassigned) > 0:
            unassigned_display = unassigned
        else:
            unassigned_display = no_videos_to_watch
        if len(your_videos) > 0:
            your_videos_display = your_videos
        else:
            your_videos_display = no_videos_to_watch
<<<<<<< HEAD
        intro_blocks = welcome_block + [
=======
        intro_blocks = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Hello! :wave:\n\nWelcome to Videosupport! *We let your customer show, not tell*.\n\nEasily generate a link to share with your customers, for them to record a video that you will receive here in Slack. Just type */videosupport* to get started!",
                },
            },
            {"type": "divider"},
>>>>>>> 01e1a72 (layout(v2): new layout)
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": ":film_projector: Unwatched videos",
                    "emoji": True,
                },
            },
        ]
        div_your_videos = [
            {
                "type": "divider",
            },
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": ":film_projector: Your videos",
                    "emoji": True,
                },
            },
        ]
<<<<<<< HEAD
        if authorized:
            blocks = intro_blocks + unassigned_display + div_your_videos + your_videos_display
        else:
            dashboard_url = base_url('account/login')
            unauth_msg = [{
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Trial expired",
                    "emoji": True,
                },
            }, {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"Unfortunately, your trial has expired. If you are an account admin, go to your <{dashboard_url}|Dashboard> to buy a plan"
                }
            }]
            blocks = welcome_block + unauth_msg
=======
>>>>>>> 01e1a72 (layout(v2): new layout)
        client.views_publish(
            user_id=user_id,
            view={
                "type": "home",
                "title": {
                    "type": "plain_text",
                    "text": "Videosupport",
                },
<<<<<<< HEAD
                "blocks": blocks,
=======
                "blocks": intro_blocks
                + unassigned_display
                + div_your_videos
                + your_videos_display,
>>>>>>> 01e1a72 (layout(v2): new layout)
            },
        )


@app.event("message")
def message_event(body, logger): ...


<<<<<<< HEAD
def create_video_message(client_id, client, team_id, user_id):
=======
def create_video_message(client, team_id, user_id):
    client_id = find_client_id(team_id)
>>>>>>> 01e1a72 (layout(v2): new layout)
    profile = client.users_profile_get(user=user_id)["profile"]
    requester = {"name": profile["display_name"], "email": profile["email"]}
    try:
        link_url = vs_request_link(client_id, user_id, requester=requester)
        message = f":film_projector: Share this ({link_url}) link & receive a recorded video inside Slack"

    except:
        message = f"Sorry! We couldn't find your account in our database. Please email hello@videosupport.io for support"
    return message

<<<<<<< HEAD
def respond_help(respond):
    respond("Hello :wave:!\nHere's how to use the Videosupport Slack integration:\n`/videosupport` Creates a link that you can share with customer to record a video\n`/videosupport subscribe` Subscribes the current channel to receive video notifications\n`/videosupport help` Displays this message")

def db_subscribe(client_id, channel_id):
    hook = {
        "id": channel_id,
        "name": "Send video to Slack channel",
        "url": base_url("slack/send-to-channel"),
        "data": {
            "channelId": channel_id,
        }
    }
    request_url = base_url('db/account/add-hook')
    header = {
        'Authorization': f"Bearer {sign_jwt(client_id)}"
    }
    requests.post(request_url, json=hook, headers=header)

def db_unsubscribe(client_id, channel_id):
    hook = {
        "id": channel_id,
    }
    request_url = base_url('db/account/delete-hook')
    header = {
        'Authorization': f"Bearer {sign_jwt(client_id)}"
    }
    requests.post(request_url, json=hook, headers=header)

def respond_subscribe(client_id, channel, channel_id, respond, say, user, client):
    if channel == 'directmessage':
        respond(f"Cannot subscribe a private conversation. Use `/videosupport subscribe` in a channel")
    else:
        cannot_join = False
        try:
            client.conversations_join(channel=channel_id)
        except:
            cannot_join = True
        try:
            say(f"Hello :wave:!\nThis channel has been subscribed for Videosupport notifications by <@{user['id']}>")
            db_subscribe(client_id, channel_id)
        except Exception as e:
            if cannot_join:
                respond(f"Cannot subscribe to this channel. If it's a private channel, add the Videosupport App to it and try again.")
            else:
                respond(f"Cannot subscribe to this channel: unknown error. Contact us at hello@videosupport.io for support")

def respond_unsubscribe(client_id, channel, channel_id, respond, say, user, client):
    if channel == 'directmesage':
        respond(f"Cannot subscribe/unsubscribe a private conversation. Use `/videosupport unsubscribe` in the channel that you'd like to unsubscribe")
    else:
        client.conversations_join(channel=channel_id)
        db_unsubscribe(client_id, channel_id)
        say(f"This channel has been unsubscribed for Videosupport notifications by <@{user['id']}>")

def client_id_from_team_id(team_id: str):
    db_client = DB.collection(CLIENTS_COLLECTION).where('settings.integrations.slack.teamId', '==', team_id).get()
    if len(db_client) == 1:
        return db_client[0].id
    else:
        return None

@app.action('primary_subscription_button')
def primary_url_button(ack):
    # just acknowledge and do nothing
    ack()

@app.action('secondary_subscription_button')
def secondary_url_button(ack):
    # just acknowledge and do nothing
    ack()

def check_client_authorized(client_id: str):
    '''
    Checks whether the team is authorized (has subscription & user has seat).
    '''
    verify_url = base_url('account/verify')
    res = requests.post(verify_url, headers={
        "Authorization": f"Bearer {sign_jwt(client_id)}"
    })
    return json.loads(res.text)["authorized"]

def respond_client_not_found(respond):
    '''
    Responds with a message that the client wasn't found
    '''
    respond(f"We couldn't find your Videosupport account. Please contact us at hello@videosupport.io and send us your team ID for reference: {team_id}")

def respond_client_unauthorized(respond):
    '''
    Responds with a message that the client wasn't found
    '''
    dashboard_url = base_url('account/login')
    respond(f"Your trial has expired. If you are an admin, go to <{dashboard_url}|your dashboard> to buy a plan")

    

@app.command(VIDEOSUPPORT_SLASH_CMD)
def command_videosupport(ack, body, respond, client, say):
    ack()
    user_id = body['user_id']
    team_id = body['team_id']
    client_id = client_id_from_team_id(team_id)
    if client_id is None:
        respond_client_not_found(respond)
        return
    authorized = check_client_authorized(client_id)
    if not authorized:
        respond_client_unauthorized(respond)
        return
    channel_name = body['channel_name']
    channel_id = body['channel_id']
    cmd = body['text'] if 'text' in body else 'link'
    if cmd == 'help':
        respond_help(respond)
    elif cmd == 'subscribe':
        user = client.users_info(user=user_id)
        respond_subscribe(team_id, channel_name, channel_id, respond, say, user["user"], client)
    elif cmd == 'unsubscribe':
        user = client.users_info(user=user_id)
        respond_unsubscribe(team_id, channel_name, channel_id, respond, say, user["user"], client)
    elif cmd == 'link':
        respond(":purple_heart: Link being created, stand by...")
        message = create_video_message(client_id, client, team_id, user_id)
        respond(message)
    else:
        respond(f"Sorry! The command `/videosupport {cmd}` is not recognized. Type `/videosupport help` to check valid commands")
=======
@app.command("/videosupport")
def command_videosupport(ack, body, respond, client):
    ack()
    user_id = body['user_id']
    team_id = body['team_id']
    message = create_video_message(client, team_id, user_id)
    respond(message)
>>>>>>> 01e1a72 (layout(v2): new layout)


flask_app = Flask(__name__)
handler = SlackRequestHandler(app)

@flask_app.route("/slack/events", methods=["POST"])
def slack_events():
    return handler.handle(request)

@flask_app.route("/slack/install", methods=["GET"])
def slack_install():
    return handler.handle(request)

@flask_app.route("/slack/oauth_redirect", methods=["GET"])
def slack_oauth():
    return handler.handle(request)

@flask_app.route("/", methods=["GET"])
def root():
    return redirect('https://videosupport.io')

if __name__ == "__main__":
    serve(flask_app, host="0.0.0.0", port=PORT)
