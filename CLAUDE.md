# Builder's Bowl: brief for contributors and their agents

Read this first. It's everything you need to start; ask in a pull request or issue if something's missing.

## What Builder's Bowl is

Builder's Bowls are the hands-on build sessions at Catfooding meetups in Bangkok. People bring a coding agent and build things: apps, games, agents, skills. **Builder's Bowl is the marketplace where those builds are listed,** so people can find them, try them and see who made them.

It lives on **catfooding.com**, replacing today's Builder's Bowls page (a page, or an overlay on the site). This repo is where it's built. The Catfooding team brings it into the site by pull request.

**Version 1 is a listing:**
- featured and newest builds
- an **Apps** area, plus filters for games, agents and skills
- a detail view per listing
- every listing labelled with its network (testnet or mainnet) and which Bowl it came from

**The first listing** is Builder's Bowl #1's own exercise, the Catfooding onchain skills kit (a skill). It's in `listings/catfooding-onchain-skills.json`.

**Done for v1 means:**
- the views above work, on a phone too
- listings come from files in this repo
- adding a listing is a pull request with one new file
- the `bowl/` folder drops into catfooding.com without changes (see below)
- no keys or secrets anywhere

**Not in v1:** buying, selling, tips, payments, sign-in, upvotes. See "Out of scope".

## A listing

One file per listing: `listings/<slug>.json`. The slug is lowercase with hyphens and matches the file name.

```json
{
  "slug": "catfooding-onchain-skills",
  "name": "Catfooding onchain skills",
  "kind": "skill",
  "tagline": "Give your coding agent the skills to adopt an Agent Cat on Avalanche Fuji and hunt for fake stock tokens.",
  "builder": { "name": "Catfooding", "x": "Catfoodingcom", "github": "catfoodingcom" },
  "links": {
    "try": "https://github.com/catfoodingcom/catfooding-onchain-skills/blob/main/START-HERE.md",
    "code": "https://github.com/catfoodingcom/catfooding-onchain-skills"
  },
  "media": null,
  "needs": [
    "A coding agent that can run commands (Claude Code, Codex or similar); a chat-only assistant can explain the steps but can't do them",
    "Node.js 20 or newer",
    "A free Avalanche Builder Hub account, for test AVAX from the faucet: https://build.avax.network/academy/avalanche-l1/avalanche-fundamentals/04-creating-an-l1/01a-create-builder-account",
    "Optional: a browser wallet (MetaMask, Core, OKX Wallet…) to pat and feed your cat on the site"
  ],
  "network": "testnet",
  "chain": "Avalanche Fuji",
  "bowl": 1,
  "featured": true,
  "added": "2026-11-09"
}
```

- `kind`: `app`, `game`, `agent` or `skill`.
- `links`: https only. `code` is optional.
- `media`: optional, `listings/media/<slug>.png`, 1200×630, under 500 KB.
- `needs`: optional. What someone needs before they try it, one short line each. Show it on the detail view as "Before you start".
- `network`: `testnet`, `mainnet` or `none`. `chain` is optional free text.
- `bowl`: the Builder's Bowl it came from (a number), or `null`.
- `featured`: set by the team, not by the builder.

**The index:** `npm run index` checks every listing and writes `listings/index.json` (all listings, newest first). The check fails on a bad file, and runs on every pull request. **catfooding.com reads `listings/index.json`,** so keep its shape stable; if you change it, say so in the pull request.

## How it fits into catfooding.com

catfooding.com is a Next.js 16 site in **plain JavaScript (JSX) and plain CSS**. Its pages sit in one app and switch with `?page=…`; Builder's Bowls is `?page=builders`. Build so your work drops straight in:
- **Everything that goes to the site lives in `bowl/`:**
  - `bowl/BuildersBowl.jsx`: the one component the site renders
  - `bowl/components/`: the pieces (ListingCard, NetworkBadge, filters, detail view)
  - `bowl/lib/listings.js`: reads and checks listings; the only place that knows where they come from
  - `bowl/bowl.css`: all styles, every class prefixed `bowl-`
- **`BuildersBowl` takes its data as a prop** (`<BuildersBowl listings={…} />`). No global state, no router of its own: use component state, or `?page=builders&l=<slug>` for a listing's detail.
- **Use only the site's CSS variables** (below). Don't restyle the page around you.
- **`app/` in this repo is a preview only:** a small page that renders `<BuildersBowl>` on the site's background so you can see it. It doesn't go to the site.
- **Links to Catfooding are plain public URLs:** catfooding.com, app.catfooding.com, the kit.

## Look and feel

Match catfooding.com: dark, quiet, one violet accent. These are the site's own CSS variables; use them by name:

| Variable | Value | Use |
|---|---|---|
| `--ink` | `#06070b` | page background |
| `--ink-lift` | `#0c0e15` | cards |
| `--bone` | `#edeae2` | text |
| `--bone-dim` | `#9a9caa` | secondary text |
| `--bone-faint` | `#5c5f6d` | hints, disabled |
| `--accent` / `--accent-lift` | `#6b5bff` / `#8d81ff` | links, buttons, the one accent |
| `--rule` | `rgba(237,234,226,0.16)` | borders and dividers |
| `--font-display` | Bricolage Grotesque | text and headings |
| `--font-mono` | IBM Plex Mono | labels, tags, meta lines ("Testnet · Bowl #1") |

- The preview page defines these in `app/preview.css`, copied from the site. Inside the site they already exist.
- **Status colours** (testnet label etc.): green `#3ddc97`, amber `#ffb84f`, red `#ff5d5d`. Use them for status only, never decoration.
- **Cards:** lifted background, a thin `--rule` border, rounded corners, generous padding. Media at 1200×630.
- **Words:** short and plain. "Agent Cats", never "NFTs". Say "testnet" wherever test money is involved.
- Catfooding's designer may update the look. Keep every colour and font in variables, so a change is one place.

## Stack and conventions

- **Next.js 16, React 19, JavaScript (JSX), plain CSS:** the same as catfooding.com. No TypeScript, Tailwind or UI library in `bowl/`.
- **Node.js 20 or newer.** npm.
- **Next.js 16 differs from older versions.** Check `node_modules/next/dist/docs/` before using an API from memory.
- **Layout:**
  ```
  bowl/                what goes to catfooding.com (see above)
  listings/            one JSON file per listing, media/, index.json (generated)
  scripts/index.js     checks listings, writes listings/index.json
  app/                 the preview page only
  ```
- **No new dependencies in `bowl/`** without asking in the pull request; the site has to carry them.
- **Run it:** `npm install`, `npm run dev` (preview), `npm run index`, `npm run build`.

## How to contribute

1. **Fork** the repo (or, if you're on the team, create a branch). Never push to `main`.
2. Work on a branch: `feat/apps-area`, `listing/my-game`.
3. Open a **pull request**: what it does, a screenshot for anything visible, and anything that changes the listing shape.
4. **JC reviews and approves every merge.**

**Adding a listing:** one new file in `listings/` (plus an optional image in `listings/media/`), in a pull request titled `listing: <name>`.

**Checks before a listing is merged:**
- the links work and use https
- the network is labelled correctly
- nothing asks for keys, seed phrases or real funds without saying so plainly

## Never commit

This repo is public and git keeps history forever.
- No keys, tokens, `.env` files, seed phrases or private keys. If you think you need a secret, stop and ask; v1 shouldn't need one.
- No private details: emails, phone numbers, or wallet addresses beyond a builder's own public listing.
- Nothing copied from other projects' private code.

## Out of scope (for now)

- Payments, selling, tips, tokens of any kind, or anything that holds or moves people's money.
- Sign-in, wallets, accounts, upvotes. These may come later, as a separate decision.
- Hosting other people's apps: listings link out; nothing runs here.
- Trading tools or market advice of any kind.
- Pulling listings from elsewhere automatically.
