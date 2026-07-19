# Ought

Ought is a browser extension for people who lose the first five minutes of every work session to autoplay.

## Inspiration

There's a window every time you sit down to work. You mean to open GitHub. Somewhere between typing the URL and it loading, YouTube gets there first. It's not really a willpower thing — opening your real workspace and opening something that'll eat your afternoon take almost exactly the same amount of effort, so whichever one loads faster wins.

We didn't want another blocker app guilting you into staying on task. We wanted the productive option to just be easier to reach than the distracting one, full stop.

## What it does

Ought lets you save a group of sites as a named workspace, "Code," "Study," whatever, and open all of them with one click instead of typing five URLs in the right order every morning.

You don't have to build these from scratch either. Open whatever tabs you actually need, hit "capture current tabs," and it saves that exact set as a workspace on the spot.

The part that took the most iterations is the Entertainment tag. Mark a workspace as Entertainment (YouTube, Netflix, whatever your version is) and clicking it doesn't open it right away. You get a 10-second countdown and a quote first. Nothing's blocked, you can click through, but that ten seconds is usually enough to make you actually think about what you're doing instead of clicking on autopilot.

Everything stays on your machine. No login screen, nothing synced out. Install it and go.

## How we built it

Plain HTML, CSS, and vanilla JS, no framework, nothing running server-side. We stuck to the standard WebExtension APIs instead of Chrome-only ones so it wasn't locked to one browser from day one.

Workspaces get saved through storage.local, so there's no backend to stand up and no login screen to build. The whole thing runs off the tabs API: grab what's currently open, save it, reopen it later with a click.

For the UI we went with a small centered popup rather than a full page, with a light/dark toggle and a Work/Entertainment tag on each card.

## Challenges we ran into

First attempt was a full new-tab-page override, replacing Chrome's default tab entirely. It ended up looking like a bloated web app crammed into a browser tab. Not what we wanted. Switching to a compact popup meant rewriting most of the CSS and rethinking the layout from scratch.

The edit-workspace screen was the harder problem: letting someone add, remove, and reorder URL fields on the fly, and prefill that list from whatever tabs they currently have open, without React or any state library underneath it. Mostly manual DOM manipulation and a lot of event listener bookkeeping.

## Accomplishments that we're proud of

Getting a genuinely dynamic UI working in plain JS is the thing we're happiest with. Fields get added, removed, and pulled in from open tabs, all through raw DOM manipulation, and it holds up.

Onboarding is basically instant. No account, nothing syncing in the background. You're using it within a few seconds because there's just local storage sitting behind it.

We're also proud of the 10-second delay. A hard blocker would've been the easier build, but people uninstall those the moment they're annoyed. Making someone sit through a countdown instead of hitting a wall treats them like they can make their own call.

## What we learned

Skipping the backend mattered more than expected. No cloud database, just storage.local, and the extension loads instantly and works offline. Privacy wasn't something we bolted on afterward, it just came for free from never sending data anywhere.

The dynamic URL interface was the real work here. No framework to lean on meant actually thinking through state, event listeners, and re-rendering by hand.

We also ended up caring more about cross-browser support than we planned to. Once we dropped the Chrome-specific naming and stuck to standard WebExtension APIs, it started working across Firefox, Brave, and Edge without extra effort.

## What's next for Ought

A couple things we didn't get to: scaling the countdown automatically based on how close your next deadline is, and for Work workspaces, remembering the exact timestamp on a paused tutorial video so it picks up where you left off instead of restarting.
