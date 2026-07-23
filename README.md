# Ought

Ought is a small Firefox extension that helps you get into work mode a little faster.

You know when you open your browser to do something productive, then somehow end up on YouTube, Reddit, or somewhere else you didn’t mean to be.

## Why I made this

The problem usually isn’t discipline. It’s that distractions are just one click away.

I didn’t want to make another blocker that just gets in your way. I wanted something that makes it easier to do the thing you already meant to do.

## What it does

- Workspaces let you save a group of sites under one name, like Code or Research.
- Capture current tabs lets you save whatever is already open as a workspace.
- Entertainment workspaces show a short 10-second countdown before opening. It’s not meant to fully block you, just give you a quick pause.
- Everything stays local. No account, no sync, no server.

## How it works

Ought is built with plain **HTML**, **CSS**, and vanilla JavaScript.

It uses standard WebExtension APIs and storage.local. This ensure everything stays on your machine. I kept it Firefox-only for now so I could keep the scope small and not overcomplicate things.

A few things that were annoying

I first tried replacing Firefox’s default new tab page, but that felt way too heavy. Switching to a smaller popup made more sense, even though it meant reworking the layout.

The workspace editor was probably the trickiest part. Adding, removing, and reordering URLs without a framework meant a lot of manual **DOM** work and event handling.

## Run locally

If you want to try it yourself:

## Clone the repo.

Open Firefox and go to about:debugging. ## Click This Firefox. ## Click Load Temporary Add-on… and select manifest.json.

## AI note

I used ChatGPT and Claude a bit for brainstorming quotes for the delay screen and for helping debug some annoying event listener issues.

## What’s next

A few ideas I might add later:

- make the countdown smarter based on deadlines
- remember the exact timestamp of paused YouTube videos
- clean up the workspace editor a bit more
