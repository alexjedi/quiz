# CLAUDE.md

Working rules for Claude in this repository. These override any default behavior.

## Rules

1. **Ask about design decisions.** Don't pick an architecture, library, data model, API shape, or UX direction on your own. Lay out the options with a recommendation and wait for an answer.
2. **Plan before you implement.** For anything beyond a trivial fix, write the plan first (approach, files touched, trade-offs) and get approval before writing code.
3. **Never commit, and never add co-author lines.** Don't run `git commit`, `git push`, or anything that rewrites history. Leave changes in the working tree for review. Don't add `Co-Authored-By` or other attribution trailers anywhere.
4. **Reuse existing assets and components.** Before creating a new component, util, style, icon, or asset, search `src/components/` for one that already does the job and extend it. Don't add duplicates.
5. **Performance comes first.** It is the main criterion for every decision. Prefer the approach with fewer allocations, fewer re-renders, smaller bundles, and less work on the main thread. Point out the performance cost of any change you propose.
6. **Never test visually.** Don't launch the app, take screenshots, or drive a browser to check UI. Visual verification is done by the maintainer. When a change needs a visual check, say exactly what to look at and hand it over.
7. **Never write comments in code.** No line, block, or doc comments. Make names and structure carry the meaning.

## Stack and conventions

- **Platform**: web only, TypeScript. Vite, React, Tailwind CSS 4, `pnpm`. Deployed to `quiz.alexvoid.com` as a Cloudflare Worker with Static Assets (`wrangler.jsonc`).
- **Realtime**: one `Room` Durable Object per room code (`worker/room.ts`), plain WebSockets, state in memory only. The server owns the clock, the correct answer and the scoring.
- **Shared rules**: `src/game/protocol.ts` (message and state types) and `src/game/scoring.ts` (points, streak milestones, limits) are imported by both the client and the worker. Keep them free of DOM and Workers APIs.
- **Layout in `.tsx`**: prefer more small `.tsx` layout components over logic-heavy `.ts` files for UI. Reusable pieces live in `src/components/`, whole screens in `src/screens/`.
- **Styling**: Tailwind classes in the `.tsx`. The only CSS files are `src/styles.css` (Tailwind entry, tokens, keyframes) and `src/themes.css` (theme hues).
- **Press feel**: every interactive element uses the shared classes in `src/components/press.ts` (scale up on hover, scale down and sink on press).
- **Icons and art**: hand-drawn inline SVG components in `src/components/icons.tsx`, `Avatar.tsx`, `Logo.tsx`, `Background.tsx`. No icon packages.
- **Dependencies**: React and the Nunito font only. Prefer a few lines of code over a new package.

## Content

- **Questions**: one JSON file per pack in `src/questions/`, registered with one import line in `src/questions/index.ts`. The first answer in `a` is the correct one; the server shuffles.
- **Themes**: one block in `src/themes.css` plus one entry in `src/state/themes.ts`.
