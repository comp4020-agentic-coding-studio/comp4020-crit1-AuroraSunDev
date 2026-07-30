# Process overview

A reading-guide to how the work came together --- a map to your process, not an
essay about it. Markers read this file and follow its citations; they don't
trawl the repo for evidence you didn't point at, so if a moment mattered, cite
it.

This file is the shape; the course site's
[assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#what-you-submit)
is the requirement, and each brief adds its own word count and moment count.

## What I built

A four-page shrine to one sentence I keep coming back to ("go right through
it... and then get out the other end"), built in a 90s-brutalism style ---
thick black borders, hard drop shadows, a scrolling marquee, blue/yellow/red
throughout. It's pure HTML and CSS: no JavaScript, no bundler.

## The moments that mattered

1. **The template ships Vite + TypeScript by default; the spec doesn't allow
   it.** C1's published spec says "built with plain HTML and CSS, no
   JavaScript." Keeping the template's default stack and just not writing any
   `.ts` would have left the tooling (and its assumptions) in place; instead
   I removed Vite, TypeScript and the TS linter outright and replaced `pnpm
   build`/`pnpm dev` with a plain copy-to-`dist` script and a zero-dependency
   static server, so there's nothing left in the repo that could reintroduce
   JS by habit. I know it held because `spec/crit-1.test.ts` asserts zero
   `.js` files and zero `<script>` elements in the built output, not just
   that I didn't add any today
   ([`81a906d`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-AuroraSunDev/commit/81a906d)).

2. **My first plan was a single page; the actual spec ruled that out.**
   Before writing any markup, I'd assumed one page would satisfy "keep it
   dead simple." Reading the spec's fetched JSON rather than my own paraphrase
   of it surfaced a line I'd have otherwise missed: "a handful of pages of
   readable content, each reachable from the home page." That changed the
   plan to four pages (home, the sentence, why it matters, guestbook) before
   any HTML existed, rather than bolting pages on after the fact
   ([`0f23104`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-AuroraSunDev/commit/0f23104)).

3. **Turned the spec's two checkable lines into a test instead of eyeballing
   them.** "No JavaScript" and "each page reachable from home" are both easy
   to get right once and silently break later. `spec/crit-1.test.ts` builds
   `dist/` and asserts both directly: it walks every built page for `<script>`
   tags and `.js` files, and checks the home page's `<a href>`s against the
   full page list. Running `pnpm check` is how I know it's still true, not a
   one-time visual check
   ([`0f23104`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-AuroraSunDev/commit/0f23104)).

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that the
current reflection entry is in `reflections/`, and that your `CLAUDE.md` is
there --- before a marker ever opens the file. It checks that your map is
traceable, not that it is good: the marker judges whether your small,
deliberately chosen set of moments shows real judgement and reflection. A green
check is not a substitute for that curation.

Images are deliberately not checked, because whether one renders is visible the
moment you look. Open this file on GitHub and look at it before you ship.
