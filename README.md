# Chesscube

A free chess site built on the MERN stack. Accounts are optional: guests can play, solve puzzles and study, and signing in adds ratings, match history, friends and a daily puzzle streak.

## Features

- **Play online:** quick pairing with preset time controls, an open lobby for custom games (standard or Chess960, rated or casual), friendly challenges, rematches, draw offers and premoves. Games are server-authoritative and survive a server restart.
- **Play the computer:** Stockfish in the browser, 8 levels.
- **Puzzles:** a Lichess puzzle subset with a Glicko-2 puzzle rating, plus a daily puzzle and streak.
- **Learn:** an analysis board with engine lines and a variation tree, and 18 interactive lessons.
- **Leaderboard:** top 100 per category.
- **Socials:** friends, requests, online presence and spectating friends' games.
- **Profile:** ratings, match history, avatar, username, email and password changes, account deletion.
- **Settings:** light and dark themes, six piece sets, board colours, gameplay options and sound themes.

## Stack

- **Client:** React 19 + Vite, React Router, [react-chessboard](https://github.com/Clariity/react-chessboard), [chessops](https://github.com/niklasf/chessops), [Socket.IO client](https://socket.io/), [Stockfish.js](https://github.com/nmrugg/stockfish.js), [chess.js](https://github.com/jhlywa/chess.js) (home page engine game), [Google Identity Services](https://developers.google.com/identity/gsi/web)
- **Server:** Node.js 22 + Express 5, Mongoose, [Socket.IO](https://socket.io/), chessops, [Nodemailer](https://nodemailer.com/) + the Gmail API, zod, bcryptjs, JSON Web Tokens
- **Database:** MongoDB Atlas

## Project structure

```
client/                 React app (deployed to Vercel)
  public/pieces/        piece sets
  scripts/              validateLessons.js (npm run lessons:check)
  src/
    components/         UI building blocks, board, game screen, page sections
    context/            auth and settings state
    data/               board options, lessons, computer levels
    hooks/              game, puzzle, analysis and socket hooks
    lib/                API client, socket, Stockfish worker, chess rules
    pages/              one component per route
    shared/             constants shared with the server (kept identical)
server/                 Express API + Socket.IO (deployed to Render)
  scripts/              importPuzzles.js, storageReport.js, sendTestEmail.js, gmailAuth.js
  src/
    config/             environment variables
    middleware/         auth, validation, rate limits, errors
    models/             Mongoose models
    realtime/           Socket.IO: games, lobby, presence, challenges
    routes/             REST endpoints
    services/           mail, tokens, ratings, daily puzzle, account deletion
    lib/                Glicko-2, ids, chess rules (kept identical to the client copy)
    shared/             constants shared with the client
  test/                 node:test suites
```

`client/src/shared` and `server/src/shared` must stay identical, and so must the two `lib/chess` folders. Check with `git diff --no-index server/src/shared client/src/shared`.

## Running locally

Requirements: Node.js 22.15+ and a MongoDB database (an Atlas free cluster or a local `mongod`).

```bash
# API
cd server
cp .env.example .env    # fill in MONGODB_URI and JWT_SECRET at least
npm install
npm run dev             # http://localhost:3001

# Client (in a second terminal)
cd client
cp .env.example .env
npm install
npm run dev             # http://localhost:3000
```

In development Vite proxies `/api` to `http://localhost:3001`, and the Socket.IO client connects straight to `VITE_API_URL`.

### Email

Sign-up, password reset and email change send 6-digit codes from a Gmail account, by one of two routes. Without either, the server prints emails to the console in development; one is required when `NODE_ENV=production`. If both are set, the Gmail API is used.

**Gmail API over HTTPS (use this in production).** Free hosts such as Render block the SMTP ports, but HTTPS always works.

1. In the [Google Cloud console](https://console.cloud.google.com/) (the same project as Google sign-in is fine), open **APIs & Services → Library**, find **Gmail API** and click **Enable**.
2. Under **Google Auth Platform → Audience**, make sure the app is **In production** (published). Refresh tokens issued while it is in Testing expire after 7 days.
3. Under **Google Auth Platform → Clients**, create a client of type **Desktop app**. Copy its client ID and secret.
4. In `server/.env`, set `GMAIL_USER` (the sending address), `GMAIL_CLIENT_ID` and `GMAIL_CLIENT_SECRET`.
5. Run `cd server && npm run gmail:auth`, open the printed link, sign in with that Gmail account and allow sending. Google warns that the app isn't verified: choose **Advanced → Go to … (unsafe)**; only you see this. The terminal prints `GMAIL_REFRESH_TOKEN=…`; add it to `server/.env`.

**SMTP with an app password (simplest locally).**

1. Turn on 2-Step Verification for the Gmail account.
2. Open <https://myaccount.google.com/apppasswords>, create an app password and copy the 16 characters (spaces are ignored).
3. Set `SMTP_USER` to the Gmail address and `SMTP_PASS` to the app password.

Send a test message with either route: `cd server && node --env-file=.env scripts/sendTestEmail.js you@example.com`

### Google sign-in (optional)

1. In the [Google Cloud console](https://console.cloud.google.com/apis/credentials), create an OAuth client ID of type **Web application**.
2. Add `http://localhost:3000` (and your production client URL) to **Authorised JavaScript origins**.
3. Put the client ID in both `GOOGLE_CLIENT_ID` (server) and `VITE_GOOGLE_CLIENT_ID` (client).

Without a client ID the Google button is hidden.

### Puzzles

The puzzles collection is a subset of the [Lichess puzzle database](https://database.lichess.org/#puzzles), sampled evenly across ratings (about 130k puzzles, ~40 MB with indexes):

```bash
cd server
npm run import:puzzles -- --dry-run        # samples and reports, writes nothing
npm run import:puzzles                     # streams lichess_db_puzzle.csv.zst and imports
npm run import:puzzles -- --file ./lichess_db_puzzle.csv.zst --reset   # use a downloaded file, replace existing puzzles
```

`npm run storage` prints data and index size per collection against the 512 MB Atlas Free limit.

### Tests and checks

```bash
cd server && npm test              # rules, premoves, Glicko-2, puzzles, game sessions, lobby
cd client && npm run lessons:check # every lesson position and goal is valid and solvable
```

## Environment variables

| Where | Variable | Required | Description |
| --- | --- | --- | --- |
| server | `MONGODB_URI` | yes | MongoDB connection string |
| server | `JWT_SECRET` | yes | Random string of at least 32 bytes for signing session and socket tokens: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| server | `CLIENT_ORIGIN` | | Allowed frontend origin(s), comma-separated (default `http://localhost:3000`) |
| server | `PORT` | | API port (default `3001`) |
| server | `NODE_ENV` | | `production` in deployment (secure cookies, proxy trust, email required) |
| server | `GOOGLE_CLIENT_ID` | | OAuth client ID for Google sign-in |
| server | `GMAIL_USER` | in production* | Gmail address that sends email (Gmail API route) |
| server | `GMAIL_CLIENT_ID` | in production* | Desktop app OAuth client ID |
| server | `GMAIL_CLIENT_SECRET` | in production* | Desktop app OAuth client secret |
| server | `GMAIL_REFRESH_TOKEN` | in production* | From `npm run gmail:auth` |
| server | `SMTP_USER` | | Gmail address (SMTP route) |
| server | `SMTP_PASS` | | Gmail app password (SMTP route) |

\* Production needs the four `GMAIL_*` variables, or `SMTP_USER` and `SMTP_PASS` on a host that allows port 587.
| client | `VITE_API_URL` | yes | Origin of the API, used by the Socket.IO connection (no trailing slash) |
| client | `VITE_GOOGLE_CLIENT_ID` | | Same value as `GOOGLE_CLIENT_ID` |

## Deployment

```
Browser ── REST /api/* ── Vercel rewrite ──► Render: Express + Socket.IO ──► MongoDB Atlas
        └─ Socket.IO (websocket) ──────────► Render            └──► Gmail API (HTTPS)
```

- **Database:** a MongoDB Atlas Free cluster. Allow connections from the API host (or `0.0.0.0/0`) under Network Access.
- **API (Render, free web service):** root directory `server`, build command `npm ci`, start command `npm start`, health check path `/api/health`. Set the server variables above with `NODE_ENV=production`, the four `GMAIL_*` variables (Render's free tier blocks SMTP) and `CLIENT_ORIGIN` set to the Vercel URL. Render provides `PORT`. A free service sleeps after 15 minutes without traffic and takes about a minute to wake; the site shows a "Waking up the server" note meanwhile.
- **Client (Vercel):** import the repository with `client` as the root directory (Vite preset). Set `VITE_API_URL` to the Render URL and `VITE_GOOGLE_CLIENT_ID`.
- **`/api` rewrite:** REST calls use the relative `/api` path so the session cookie stays first-party. In `client/vercel.json`, replace `YOUR-RENDER-APP` in the API rewrite with your Render service's name. A Vercel build fails with a clear message while the placeholder is still there or `VITE_API_URL` is missing.
- **Google sign-in:** add the Vercel URL to the OAuth client's Authorised JavaScript origins.

Live games are held in the API's memory, so run a single instance. Active games are saved on shutdown (SIGTERM) and restored on start. The API logs its database size at startup and daily, with a warning above 400 MB.

## Credits

Piece sets in `client/public/pieces` come from the [Lichess](https://github.com/lichess-org/lila) project:

| Set | Author | License |
| --- | --- | --- |
| cburnett (Classic) | Colin M.L. Burnett | GPLv2+ |
| merida | Armando Hernandez Marroquin | GPLv2+ |
| staunty | sadsnake1 | CC BY-NC-SA 4.0 |
| california | Jerry S. | CC BY-NC-SA 4.0 |
| chessnut | Alexis Luengas | Apache 2.0 |
| fantasy | Maurizio Monge | MIT |

The staunty and california sets are licensed for non-commercial use only; remove them if the site is ever monetised.

- The home page engine game, play against the computer and the analysis board run the lite single-threaded build of [Stockfish.js](https://github.com/nmrugg/stockfish.js) (GPLv3), a WebAssembly port of [Stockfish](https://github.com/official-stockfish/Stockfish).
- Puzzles come from the [Lichess puzzle database](https://database.lichess.org/#puzzles) (CC0).
- Chess rules, including Chess960, use [chessops](https://github.com/niklasf/chessops) (GPL-3.0-or-later).
