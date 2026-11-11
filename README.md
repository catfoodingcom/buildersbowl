# Builder's Bowl

The marketplace for what the Catfooding community builds with their coding agents: apps, games, agents and skills, many of them demoed at Catfooding meetups in Bangkok. It lives on [catfooding.com](https://catfooding.com/?page=builders); this repo is where it's built.

**Status:** early. Version 1 is a listing.

## Add your build

1. Fork this repo.
2. Add one file, `listings/<your-build>.json`. Copy `listings/catfooding-onchain-skills.json` and see `CLAUDE.md` for the fields.
3. Open a pull request titled `listing: <name>`. We check it and merge it.

## Work on it

Next.js 16, React 19, JavaScript, plain CSS. Node.js 20 or newer.

```
npm install
npm run dev
```

Read `CLAUDE.md` first (it's written for people and their agents). Work on a branch or fork and open a pull request; every merge is reviewed. Never commit keys or `.env` files.

## Links

- Catfooding: https://catfooding.com
- The Builder's Bowl #1 kit: https://github.com/catfoodingcom/catfooding-onchain-skills

MIT licence.
