# Quiz

A quick quiz game to play with friends. One person creates a room and shares the link; everyone answers on their own device.

- 100 points for a right answer, +50 for the fastest right answer of the round.
- Streaks unlock one-time abilities: 3 in a row gives Hide one wrong answer, 5 gives 50-50, 7 gives Double time.

## Run locally

```sh
pnpm install
pnpm build         # the worker serves ./dist, so build once first
pnpm dev:worker    # room server on :8787
pnpm dev           # app on :5173, proxies /api to the worker
```

Open the app in two browser windows to play against yourself. Each tab is its own player.

## Add questions

Add a JSON file to `src/questions/` and register it with one import line in `src/questions/index.ts`:

```json
{
  "id": "my-pack",
  "title": "My pack",
  "questions": [{ "q": "Which planet has the most known moons?", "a": ["Saturn", "Jupiter", "Uranus", "Neptune"] }]
}
```

Each question needs exactly four answers. The first one is the correct one; the game shuffles them.

## Add a theme

Add a block to `src/themes.css` (`--h` panel hue, `--h2` second background hue, `--ha` accent hue, optional `--depth` to darken) and an entry in `src/state/themes.ts`.

## Change the rules

Points, streak milestones, round lengths and player limits are constants in `src/game/scoring.ts`.

## Deploy

```sh
set -a; source .env; set +a
pnpm deploy
```

Deploys a Cloudflare Worker with static assets and one Durable Object per room to `quiz.alexvoid.com` (see `wrangler.jsonc`). `.env` needs the variables listed in `.env.example`.

Made by [Alex Void](https://alexvoid.com/).
