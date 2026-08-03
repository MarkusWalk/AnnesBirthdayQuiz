# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A German-language pub quiz built for one evening: Anne's birthday, 12 August. The whole
application is a single `index.html` — no build step, no dependencies, no framework, no
test suite. Opening the file in a browser runs it.

`README.md` is the user-facing manual (quizmaster walkthrough, all `type` and `viz` kinds,
photo filenames, the Vercel/Upstash setup). Read it before changing question data or the
reveal renderers — do not duplicate its tables here.

## Language convention

**Everything user-visible and everything in the source is German**: UI strings, code
comments, `README.md`, `bilder/LIESMICH.md`, and commit messages. Commit messages are
German prose in the imperative-free descriptive style ("Säulen sichtbar, Abstimmungsfrage
geschärft"), not Conventional Commits. Match this when writing code or commits — an
English comment in the middle of `index.html` reads as foreign.

## Commands

There is no build, no lint, no test runner. Everything below is the complete set.

Run locally (this is also how the quiz is played at the party):

```bash
start index.html
```

Deploy to production (the GitHub connection is not set up, so CLI deploy is the path):

```bash
vercel deploy --prod --yes
```

Build the standalone single-page variant with images inlined as data-URIs:

```bash
python3 build-artifact.py out.html
```

`build-artifact.py` strips the `<!doctype>/<html>/<head>/<body>` frame and embeds every
`bilder/…` reference it can resolve. It is only for hosting environments that supply their
own document frame; the Vercel deployment serves `index.html` untouched.

## Architecture

### One file, two operating modes

`index.html` ships both the projector and the phone view. The URL decides which:

- **no query string** → projector (`Beamer`): timer control, scoring, reveal, keyboard shortcuts
- **`?v=ROOMCODE`** → viewer (`Mitlesefassung`): read-only, follows the projector

`VIEWER` (index.html:1571) is the single boolean that branches the two. Because both modes
are the same file, the viewer gets every reveal animation for free — but it also carries the
full `QUESTIONS` array with the answers, so DevTools on a phone exposes them. That trade-off
is deliberate and documented in `README.md`; do not "fix" it by splitting the file without
discussing it first.

The `<script>` block is organised into 14 numbered sections (`1) RUNDEN` … `14) START`).
Navigate by those headers rather than by line number.

### Content model

`ROUNDS` and `QUESTIONS` (index.html:1150, :1179) are plain arrays at the top of the script.
`STEPS` (index.html:1549) is **derived, not authored**: it interleaves a round board before
each round's first question. Everything downstream — progress dots, navigation, the sync
payload — indexes into `STEPS`, not into `QUESTIONS`. Adding a question shifts every later
step index, which invalidates a `localStorage` resume; `load()` clamps `state.step` to guard
against that.

Each question's `type` selects a `reveal*()` renderer (index.html:1942–2044) and its optional
`viz.kind` selects an animated graphic in `renderViz()` (index.html:2048). These are two
independent axes — a `single` question and an `estimate` question can share a `bars` viz.

### The sync protocol

Projector is the sole source of truth. There is no viewer→projector channel.

```
projector --POST api/state--> Redis (SET + PUBLISH) --> api/stream (SSE) --> phones
```

The transmitted state is deliberately tiny (`syncSnapshot()`, index.html:2725): screen name,
step index, revealed flag, timer values, and a monotonic sequence number `n`. Viewers reject
any payload whose `n` is not greater than the last seen — that is what makes the 15-second
heartbeat and the SSE reconnect idempotent.

**Every mutation of `state.step`, `state.revealed`, or the timer must call `syncPush()`.**
It is already wired into `showStep()`, `reveal()`, `go()`, and all timer entry points;
a new control that changes those without pushing will silently desync the phones.
`syncPush()` debounces to one request per 80 ms.

Clocks run independently on each device — only the value at each transition is sent. See
`viewerTimer()` (index.html:2779).

`api/stream.js` closes itself after 4 minutes so the browser reconnects; this keeps it inside
platform runtime limits. If the Upstash `/subscribe` channel is unavailable it degrades to
polling. Both `api/` functions declare `runtime: "edge"` and accept either env var pair:
`KV_REST_API_URL`/`_TOKEN` or `UPSTASH_REDIS_REST_URL`/`_TOKEN`. Missing storage returns 503
with a German explanation, and the projector keeps working offline.

### Invariants worth preserving

- **Offline-first.** With the sync switch off, the app makes zero network requests. `HOSTED`
  (index.html:2671) disables the switch entirely for `file://`. Never add an unconditional
  fetch, font link, or CDN reference.
- **Viewers are silent.** `tone()` returns early when `VIEWER` (index.html:1615). Twenty
  phones beeping the last five seconds against each other is the failure mode this prevents.
- **Viewers have no saved state.** `save()` returns early when `VIEWER` (index.html:1581).
- **The page never scrolls in projector mode.** The layout targets one screen height down to
  1440×900; on reveal the photos shrink and the rejected options collapse to make room. Only
  the question card scrolls, never the page. `README.md` records the measured resolutions.
  Viewer mode deliberately reverses this (`body.viewer-mode` sets `overflow:auto` and scales
  `#revealStage` with `zoom:.72`, index.html:864–901).
- **Image extensions are resolved at runtime.** `imgCandidates()` (index.html:1807) tries
  `.jpg/.jpeg/.png/.webp/.svg` in order, so question data names one path and any extension
  works. Missing images fall back to a placeholder showing the expected filename — the
  placeholder must not reveal the answer, which is why filenames are neutral (`kirche-a`,
  `gebaeude`, `bauwerk`).
- **The QR code is generated in-page** (index.html:2425, byte mode, EC level M). No library,
  no external call. Do not replace it with a CDN dependency.

### Photos

Only real photographs — no AI-generated or hand-drawn SVG substitutes. All eleven are in the
repo: five from Wikimedia Commons with attributions in `bilder/LIESMICH.md`, the other six
(Gimborn, Lindlar, lavender, three hedges) are family originals.

Filenames stay neutral (`kirche-a`, `hecke-b`, `bauwerk`) because the placeholder for a
missing image shows the expected filename on the projector, and the `src` is visible in the
page source either way. A file arriving as `Hecke_Falsch.jpeg` gets renamed before it is
wired in — the name must never carry the answer.

`.vercelignore` keeps `README.md`, `build-artifact.py`, `bilder/LIESMICH.md`, and the
unrelated `bilder/autos/` + `tiguan-vs-starray.html` out of the deployment.

## Deployment notes

Vercel project `markus-6dde/annes-birthday-quiz`, live at https://annes-birthday-quiz.vercel.app.
The project name must be lowercase — the directory name `AnnesBirthdayQuiz` is rejected by
`vercel link`, so pass `--project annes-birthday-quiz` explicitly.
