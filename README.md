# Launchpad — a focus gate for your new tab

Replaces Chrome's new tab page with a three-way choice: Study, Code, or Entertainment.
Study and Code auto-open your saved tabs, plus your last YouTube tutorial, resumed at the exact second you left it.
Entertainment shows your saved deadlines and makes you wait a few seconds before it lets you through.

## Run it right now (2 minutes)

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select this folder
5. Open a new tab, you should see the choice screen
6. Click the gear icon and paste in your real URLs, one per line:
   - Study tabs: whatever you use for PCM revision
   - Coding tabs: e.g. `github.com/MUCKSUCK-Oss/...`, Firebase console, docs
   - Deadlines: whatever's actually due, so the friction screen has real teeth
7. Save, go back, click Study or Code, it opens everything at once

## How the YouTube resume works

Watch any YouTube tutorial normally. In the background, the extension quietly saves your timestamp every 5 seconds to `chrome.storage.local`. Next time you click Study or Code, it reopens that exact video at the second you left off, alongside your saved tabs.

## What's still rough, worth deciding on before the demo

- The friction screen is a flat 8-second wait. Could scale with how close a deadline is instead.
- No custom icon yet, Chrome shows the default puzzle-piece icon in the toolbar.
- Only remembers the most recent YouTube video, not one per course/subject.
- Settings are local to this browser profile, nothing syncs across devices.
- The Entertainment button currently opens youtube.com after the wait, swap for whatever "give in" destination makes sense.

## Files

- `manifest.json` — extension config, overrides the new tab page, requests `storage` and `tabs` permissions
- `newtab.html` / `newtab.css` / `newtab.js` — the new tab page: choice screen, friction screen, settings screen
- `youtube-tracker.js` — content script that runs on YouTube watch pages and records playback position
