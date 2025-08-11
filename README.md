## Sudhanshu’s macOS‑Style Portfolio

An interactive portfolio that mimics the macOS desktop experience. It features a Dock, Top Bar, Launchpad, Spotlight, and windowed apps built with modern React tooling.

![light mode](./public/screenshots/light.png)
![dark mode](./public/screenshots/dark.png)

### Tech Stack
- React 18 + TypeScript + Vite
- UnoCSS (utility‑first styling) with preset-icons
- Zustand (state management)
- Framer Motion (Dock hover animation), react-rnd (windowing)
- Milkdown (Markdown editor), react-markdown + Prism (renderer)

### Apps Included
- Safari: start page, URL/search, or external sites via iframe
- Terminal: fake shell with `cd`, `ls`, `cat`, history, autocomplete
- Bear: Markdown reader (local/remote)
- Typora: WYSIWYG Markdown editor (demo only; for persistent notes use Notes)
- Notes: password‑gated, persistent editor with Upstash Redis
- FaceTime: Webcam capture (saves thumbnails)
- VSCode: Repo viewer (GitHub1s)

### Getting Started
1) Install dependencies
```bash
# Recommended
pnpm install
# or
npm install --legacy-peer-deps
```

2) Run the dev server
```bash
pnpm dev
# or
npm run dev
```

3) Build for production
```bash
pnpm build
# or
npm run build
```

### Configuration
- Update personal info in `src/configs/user.ts`.
- Dock/Apps: edit `src/configs/apps.tsx`.
- Launchpad links: `src/configs/launchpad.ts`.
- Websites for Safari start page: `src/configs/websites.ts`.
- Music (Control Center): `src/configs/music.ts`.
- About/Stats pages: markdown in `public/markdown/`.

### Deployment (Vercel)
This SPA deploys cleanly on Vercel (no server required for the UI). Two serverless routes power Notes persistence and unlocking:
- `/api/unlock`: verifies a password and returns a JWT (Edge/Node function)
- `/api/content`: load/save content to Upstash Redis

Required env vars (Production & Preview):
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `JWT_SECRET` (random string)
- `PASSWORD_SALT` (random string used for hashing)
- `PROFILE_A_PASSWORD_HASH`, `PROFILE_B_PASSWORD_HASH`, `PROFILE_C_PASSWORD_HASH`

Generate hashes (Node REPL):
```js
const crypto = require('crypto');
const salt = 'your-strong-salt';
const h = (p) => crypto.scryptSync(p, salt, 64).toString('hex');
console.log('A', h('meow'));
console.log('B', h('pass1'));
console.log('C', h('pass2'));
```
Set the outputs as `PROFILE_*_PASSWORD_HASH` values. Do not commit secrets.

### License
MIT
