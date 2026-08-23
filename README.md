# Sachindra & Stuti — Wedding RSVP Site

A single-page wedding invite with an RSVP form (Yes / No / Maybe + remark, no +1 option).
Every reply is appended as a row in your Google Sheet.

## What's in this folder

| File | Purpose |
|---|---|
| `index.html` | The whole website (design + form + logic) |
| `photo.jpg` | Your photo, shown in the hero section |
| `google-apps-script.gs` | Code you paste into Google Apps Script to receive replies |

## Step 1 — Connect the Google Sheet (~5 minutes)

1. Go to [sheets.new](https://sheets.new) and create a blank sheet. Name it e.g. **Wedding RSVPs**.
2. In the sheet: **Extensions → Apps Script**.
3. Delete the starter code and paste in the full contents of `google-apps-script.gs`. Save (Ctrl+S).
4. Click **Deploy → New deployment**.
   - Click the gear icon → select **Web app**.
   - Description: anything, e.g. "RSVP endpoint".
   - **Execute as: Me**
   - **Who has access: Anyone**  ← important, otherwise guest submissions are rejected.
5. Click **Deploy**, authorise with your Google account when prompted
   (it will warn "Google hasn't verified this app" — click *Advanced → Go to … (unsafe)*; it's your own script, this is normal).
6. Copy the **Web app URL** (ends in `/exec`).
7. Open `index.html` in a text editor, find this line near the bottom:

   ```js
   var SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";
   ```

   and paste your URL between the quotes. Save.

To test: open `index.html` locally in a browser, submit a test reply, and check the sheet — a row should appear on the **RSVPs** tab within a second or two.

> If you later edit the script, use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy** so the same URL keeps working.

## Step 2 — Put it online (free, ~2 minutes)

1. Create a free account at [netlify.com](https://app.netlify.com) (same service as the km26 site you liked).
2. Go to **Sites → Add new site → Deploy manually**.
3. Drag this whole folder onto the upload box.
4. You get a URL like `random-name.netlify.app`. Rename it under **Site settings → Change site name** to something like `sachindra-stuti.netlify.app`, and share that link with guests.

Alternatives that work identically: GitHub Pages, Cloudflare Pages, Vercel — all free for a static page like this.

## Updating details later

- **Time/venue confirmed?** Edit the two event cards in `index.html` (search for "to be confirmed") and re-upload the folder to Netlify (drag-and-drop again — it replaces the old version, same URL).
- **Change the photo?** Replace `photo.jpg` with any portrait-orientation photo (keep the same filename).
- **Remove the phone field?** Delete the `field` div containing the `phone` input in `index.html`; the sheet column will simply stay empty.

## Notes

- There is deliberately no +1 / party-size field — the remark box invites guests to mention who they're coming with.
- Duplicate replies are fine: each submission is a new row with a timestamp, so the latest row from a person is their current answer.
- The form uses a "fire and forget" request to Google (`no-cors`), which is the standard pattern for Apps Script forms — the guest always sees the thank-you message once the request is sent.
