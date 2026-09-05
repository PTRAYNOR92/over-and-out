# Over & Out

The daily cricket umpiring game. Six balls a day, the same six for everyone.
Watch each delivery, call OUT or NOT OUT on the LBW appeal, then Hawk-Eye shows
you the truth.

Live at: https://overandoutgame.com

---

## What's in this folder

```
index.html          The page itself — the buttons, the score, the rules card.
css/
  styles.css        All the styling: colours, fonts, layout.
js/
  1-setup.js        The canvas we draw on, plus Pat's on/off switches.
  2-sound.js        Every noise the game makes (all built in the browser).
  3-batsman.js      The batsman's body positions and the ground he stands on.
  4-deliveries.js   Invents each ball and builds the six-ball over.
  5-ball-flight.js  Where the ball is at any moment, and drawing it.
  6-hawkeye-replay.js  The Sky-style review screen.
  7-summary-screen.js  Your ticks and crosses at the end of the over.
  8-game-state.js   The score, the streak, what's remembered between visits.
  9-game-loop.js    Runs 60 times a second and draws whatever's on screen.
netlify.toml        Tells Netlify how to publish this (it's very simple).
```

The nine JavaScript files load **in number order** — each one uses things the
ones above it set up. If you ever add a new file, give it a number and add a
matching line near the bottom of `index.html`.

## Where to change things

**The two switches** — top of `js/1-setup.js`:

- `BAT_BALLS` — set to `true` to bring back bat-first and inside-edge deliveries
- `SHOW_BOWLER` — set to `true` to put the bowler back in

**Google Analytics** — top of `index.html`. Replace both copies of the
measurement ID with your own. Until you do, it quietly does nothing.

**How hard the over gets** — `RAMP` in `js/4-deliveries.js`.

**The rank names** (VILLAGE GREEN, TEST MATCH OFFICIAL...) — `rankFor` in
`js/7-summary-screen.js`.

## Hidden URL modes

- `?clip=1` — clean recording mode: no buttons or score, tap the pitch to advance.
  Good for making video clips.
- `?over=NAME` — a custom over seeded from a name, e.g. `?over=ashes`. Everyone
  with that link gets the same six balls. Doesn't affect your daily streak.

## Running it on your own computer

There's no build step and nothing to install. Double-click `index.html` and it
opens in your browser.

## How it gets published

This folder is connected to Netlify. Whenever a change is saved to the `main`
branch on GitHub, Netlify picks it up and publishes it within about a minute.
There is nothing to press.
