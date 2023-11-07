# Video Support

## Development

### Intercom

To test all intercom interactions locally, the following setup is required.

**1. NGROK Proxy Instance**\
Start a `ngrok` instance with the following command `ngrok http --region=eu <the port you're running on || 3000>`.

Next, go to your `env.development` file and swap the `PUBLIC_URL=https://76ca460b81bb.ngrok.io` with the generated one.

**2. Change Canvas Kit Urls**\
In order to make use of the Test app locally, copy and paste the `PUBLIC_URL` [here](https://app.intercom.com/a/apps/v49cmmug/developer-hub/app-packages/69125/canvas-kit):
Section: `For users, leads and visitors`

1. Initialize flow webhook URL
2. Submit flow webhook URL

**3. Intercom Demo**\
Go to the demo page [here](https://app.videosupport.io/demo):
Fill in the following workspaceId `v49cmmug`. Subject the form and you'll see the bubble apear in the bottom right corner.

**4. Add Test Space Access Token**\
Set the following variables in your `.env.development`:

- `INTERCOM_ACCESS_TOKEN`
- `COOKIE_SESSION_KEY` (choose any key)
- `JWT_SECRET_ZENDESK` (must be the same as Zendesk repository)

You can find the **Access Token** on [this page](https://app.intercom.com/a/apps/v49cmmug/developer-hub/app-packages/69125/oauth).

**5. Start Client & Server**\
After setting and generating a Proxy, start your development servers. This injects the right NODE_ENVs in the project.
See the [scripts section](#scripts).

**6. Refresh the Widget**\
Visit the [Messenger](https://app.intercom.com/a/apps/v49cmmug/messengers) Page of the test dashboard. Open the **Add apps to your Messenger** dropdown.
You can choose to add the widget for a visitor or user.

### Zendesk

To test all zendesk interactions locally, the following setup is required.

**1. Go to the Zendesk dashboard**\
Via this [🔗 link](https://d3v-videosupport5562.zendesk.com/agent/dashboard?zat=true).
Add `?zat=true` at the end of any url detects that you're in developing mode.

All zendesk related start-up commands, you can find via the [github repo](https://github.com/FrencisAlreadyInUse/videosupport-zendesk).

🚀 You're set! Happy coding.

## Environment variables

| Key                                      | Explanation                                                                 |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| PUBLIC_URL                               | The public url of videosupport.                                             |
| PUBLIC_URL_SCREEN                        | The public url of screensupport.                                            |
| GCP_SERVICE_ACCOUNT                      | JSON string of service account file on one line.                            |
| INTERCOM_CLIENT_ID                       | Intercom client id.                                                         |
| INTERCOM_CLIENT_SECRET                   | Intercom client secret.                                                     |
| INTERCOM_CALLBACK_URL                    | Intercom callback URL. The URL to return to after successfull installation. |
| INTERCOM_ACCESS_TOKEN                    | Intercom access token                                                       |
| JWT_SECRET                               | JWT sign token                                                              |
| POSTMARK_SERVER_TOKEN                    | The Postmark server token                                                   |
| POSTMARK_FROM_EMAIL                      | The Postmark from email                                                     |
| POSTMARK_VIDEO_RECORDING_TEMPLATE_ID     | The Postmark video recording template id                                    |
| POSTMARK_VIDEO_RECORDING_TEMPLATE_ALIAS  | The Postmark video recording template alias                                 |
| POSTMARK_INTERCOM_INSTALL_TEMPLATE_ID    | The Postmark intercom install template id                                   |
| POSTMARK_INTERCOM_INSTALL_TEMPLATE_ALIAS | The Postmark intercom install template alias                                |
| POSTMARK_ZENDESK_INSTALL_TEMPLATE_ID     | The Postmark zendesk install template id                                    |
| POSTMARK_ZENDESK_INSTALL_TEMPLATE_ALIAS  | The Postmark zendesk install template alias                                 |
| GOOGLE_CLIENT_ID                         | The Google client id                                                        |
| GOOGLE_CLIENT_SECRET                     | The Google client secret                                                    |
| GOOGLE_CALLBACK_URL                      | The Google callback url                                                     |
| CLOUDINARY_CLOUD_NAME                    | The Cloudinry cloud name                                                    |
| CLOUDINARY_API_KEY                       | The Cloudinary api key                                                      |
| CLOUDINARY_API_SECRET                    | The Cloudinary api secret                                                   |
| CLOUDINARY_ENV                           | The Cloudinary environment                                                  |
| COOKIE_SESSION_KEY                       | The Cookie session key                                                      |
| JWT_SECRET_ZENDESK                       | The JWT secret for zendesk                                                  |

## Development

### Git practices

1. Use conventional commit messages (https://conventionalcommits.org)
2. Keep the git history clean (no merge commits) and linear, by rebasing a branch before merging. If one were to create a PR to merge the branch `example` into `dev`, one could do:

```bash
# make sure `dev` is up to date, pull with rebase
git pull --rebase origin dev:dev

# go to `example` branch and rebase
git checkout example
git rebase -i dev

# in the next screen, one can squash, pick, drop etc commits as needed
# if there are any conflicts, use `git mergetool` to solve them (might require to install meld)
# after it's rebased, do
git push -f origin example

# then `example` can be merged into `dev`, through the github UI or command line, like below
git checkout dev
git merge example
git push origin dev
```

### Environment

Duplicate the `.env.environment.example` file and rename the copy to `.env.development`.

Like the name suggest, `.env.development` holds the variables used during development.\
This counts for `npm run server:dev` and `npm run client:dev`.

### Scripts

There are two main scripts you need to run the project

| Script               | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| `npm run server:dev` | Run the server and start watching for file changes to recompile. |
| `npm run client:dev` | Start parcel.js bundler.                                         |

### Url's for testing

1. Zendesk Integration w/o visitorEmail

```
/record/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJkb21haW4iOiJkM3YtdmlkZW9zdXBwb3J0NTU2MiIsInN1cHBvcnRFbWFpbCI6ImhlbGxvQHZpZGVvc3VwcG9ydC5pbyIsInZpc2l0b3JFbWFpbCI6IiIsImlhdCI6MTYxNjk3MzUzNH0.lDRX4dKiryf-NJLHhYo7KXXI394L_HwJH94ZuHe2Zqs
```

2. Zendesk Integration w/ visitorEmail

```
/record/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJkb21haW4iOiJkM3YtdmlkZW9zdXBwb3J0NTU2MiIsInN1cHBvcnRFbWFpbCI6ImhlbGxvQHZpZGVvc3VwcG9ydC5pbyIsInZpc2l0b3JFbWFpbCI6ImZyYW5jaXNkY2xlcmNxQGdtYWlsLmNvbSIsImlhdCI6MTYxNjk3MzcwOH0.1vedhClJVDcg6DejnHe5r4zAWm5nvzrF8hi4aYNKxP4
```

3. Web Integration

```
/record/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3aWRnZXRJZCI6IlJsZGRWWElXIiwic3VwcG9ydEVtYWlsIjoiaGVsbG9AdmlkZW9zdXBwb3J0LmlvIiwiaWF0IjoxNjE2ODc4OTc1fQ.fN4QK5DpOcYP1BOxty2O1etfhOatM3Y4nxiTVqEhc58
```

4. Intercom Integration

```
/record/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNDUzMDQ5NiIsImNvbnRhY3RJZCI6IjYwNTBiMzE5MGFlNWZjYzNhNjQ3ODI0NSIsIndvcmtzcGFjZUlkIjoidjQ5Y21tdWciLCJ1c2VyIjp7Im5hbWUiOm51bGwsImVtYWlsIjoiIiwicGhvbmUiOm51bGx9LCJjdXN0b21BdHRyaWJ1dGVzIjp7fSwiaWF0IjoxNjE2OTc1ODcyfQ.6JvW959PxpoZ6Whc-tw0p7-bzK7J6_JrelgOGz21p8w
```

5. Hubspot Integration

```
/hubspot/request?clientId=f4b23122-1f84-4e31-8861-e8e53043e047&customerEmail=bh@hubspot.com&customerName=Brian&clientEmail=francis@videosupport.io
```

If `clientId` is throwing an error, regenerate on the contact in Intercom

## Production

### Environment

Duplicate the `.env.environment.example` file and rename the copy to `.env.production`.

Like the name suggest, `.env.production` holds the variables used during production.\

Keep in mind though that no `.env.*` files are pushed to git.\
This means that if you deploy to Heroku, the production variables need to be set in Heroku's dashboard.\
Since `npm run build` is triggered on heroku, the `.env.production` file has no use locally and will not even be used by the server.\
The client part _will_ however use this file if you run `npm run client:build` locally for debugging purposes.

## Checklist for testing

### Account

- Log in to account
- Create account with new user
- Change brand colours (actually changes the colours in the demo)
- Change logo (actually changes the logo in the demo)
- Videos section shows all your videos

### General

- Old links still work (take record links generated by previous version and test with new)
- After adding message to video, it shows "Edit message", when clicked, shows old messages and allows to change it
- Feedback form shows at the end, when clicked feedback is sent
- After recording the video, user can play and preview it
- On mobile, after recording video using QR code, can see video replay
- Use an invalid payload on `/menu`, `/s/record`, `/v/record`, goes to 404
- Works with cookies disabled
- All actions send appropriate emails

### Intercom

#### Screensupport

- Record screen recording
- Screen recording with message
- Screen recording with voice message
- Click re-record, redirects back
- Press F5 during record, starts back at record
- Press F5 during preview, starts back at record
- Press F5 during done, starts back at record
- Videos go to intercom sidebar

#### Videosupport

- Record video
- Record using the QR code
- Add message
- Click re-record, redirects back
- Press F5, start back at record
- Videos go to intercom sidebar

### Zendesk

- Create screen link
- Record from screen link, see result in sidebar
- Create video link
- Record from video link, see result in sidebar
- Add message to video, shows in recording page
- Add message to screen, shows in recording page
- Add audio message to video, shows in recording page
- Add audio message to screen, shows in recording page
- Support reply, link at the end goes to correct video
- Support reply, add message and appears next to video

## Heroku

To check logs, type

`heroku logs --tail --remote staging`

Switch `staging` for `heroku` to check production

## Problem with the app! Now what?

If the app has a problem in production, which was introduced in a new deployment, you can first try to return the app to a previous state. To do that, check the git tags by typing in the terminal

```bash
git tag -l
```

This will list all the existing tags in the repository. The tags marked with `-prod` are commits which were deployed to production. So if the output of `git tag -l` is

```
v0.3-prod
v0.2-prod
v0.2-prod
```

Currently, the version in production is `v0.3-prod`, so you can go back to `v0.2-prod` and deploy it to try to fix the issue. Do that with:

```bash
git push --force heroku v0.2-prod:master
```
