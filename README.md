# Ought

Ought was built for anyone who sits down at their desk, intends to open GitHub, and somehow winds up watching a 20-minute YouTube video without realizing how they got there. It’s a simple extension aimed at fixing that dangerous five-minute window right when you start working.

## The Inspiration
Friction is the real problem here, not willpower. It takes the exact same amount of effort to open your actual workspace as it does to open a massive distraction. Because of this, the site that loads first usually wins your attention. 

We really didn't want to make another blocker that just guilt-trips you. The goal was simply to make doing the right thing easier than giving into a distraction.

## How It Works
*   **One-Click Workspaces:** Throw a bunch of sites into a group and name it "Code" or "Research." Clicking that group opens everything at once, so you aren't manually typing out URLs every morning.
*   **Instant Capture:** If you don't feel like setting things up from scratch, just get the tabs you want open and click "capture current tabs" to instantly build a workspace on the fly.
*   **The 10-Second Breather:** This is the part we tweaked the most. If you tag a workspace as "Entertainment," clicking it doesn't immediately load the sites. Instead, it hits you with a 10-second countdown and a quote. You aren't completely blocked from proceeding, but that brief pause is usually enough to snap you off autopilot.
*   **Privacy First:** All of this lives on your computer. We don't have login screens and we don't sync your data anywhere. Just install and use it.

## How We Built It 
We kept things super simple: just plain HTML, CSS, and vanilla JavaScript. There are absolutely no frontend frameworks involved, and nothing running on a server. 

Everything relies on standard WebExtension APIs and `storage.local`. Skipping the cloud database meant the extension loads instantly and works without an internet connection. Since we built this specifically for Firefox, we were able to keep our focus incredibly tight and optimize exactly for that browser's environment.

## Challenges Along the Way
Initially, we tried completely overriding Firefox's default new tab page. That turned out to be a mistake—it just felt like a heavy, bloated web app stuffed into a tab. We switched gears to a much smaller centered popup, which meant tossing out a lot of our CSS and redoing the layout completely. 

The trickiest part technically was the "edit workspace" interface. Letting people dynamically add, remove, and shuffle URLs without a tool like React meant we had to handle a lot of messy manual DOM manipulation and track a bunch of event listeners.

## Running It Locally 

Because Ought runs strictly on your own hardware, spinning it up locally is super fast:
1. Clone this repo to your computer.
2. Open Firefox and type `about:debugging` into your URL bar.
3. Click on **This Firefox** in the left-hand menu.
4. Hit the **Load Temporary Add-on...** button and select the `manifest.json` file inside the Ought project folder.

## AI Acknowledgement

We used Large Language Models (ChatGPT and Claude) mostly to brainstorm the big list of quotes that pop up during the 10-second entertainment delay. We also leaned on AI to help debug some of the really annoying event listener issues that popped up while we were writing the raw DOM manipulation code. 


## What’s Next
There are a few ideas we haven't gotten around to yet. We really want to make the countdown timer scale dynamically depending on how close an upcoming deadline is. For "Work" spaces, it'd also be great to save the exact timestamp of a paused YouTube tutorial so it resumes exactly where you left off.
