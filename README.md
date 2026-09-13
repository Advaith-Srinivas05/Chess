# Chesscube

A MERN chess site.

## Stack

- **Client:** React + Vite, React Router, [react-chessboard](https://github.com/Clariity/react-chessboard), [chess.js](https://github.com/jhlywa/chess.js), [Stockfish.js](https://github.com/nmrugg/stockfish.js)
- **Server:** Node.js + Express, Mongoose
- **Database:** MongoDB Atlas

## Project structure

```
client/   React app (deployed to Vercel)
server/   Express API (deployed to a Node host, e.g. Render)
```

## Running locally

Requirements: Node.js 22+ and a MongoDB database (an Atlas free cluster or a local `mongod`).

```bash
# API
cd server
cp .env.example .env    # fill in MONGODB_URI
npm install
npm run dev             # http://localhost:3001

# Client (in a second terminal)
cd client
cp .env.example .env
npm install
npm run dev             # http://localhost:3000
```

## Environment variables

| Where | Variable | Description |
| --- | --- | --- |
| server | `MONGODB_URI` | MongoDB connection string |
| server | `CLIENT_ORIGIN` | Allowed frontend origin(s), comma-separated |
| server | `PORT` | API port (default `3001`) |
| client | `VITE_API_URL` | URL of the API |

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

The home page engine game runs the lite single-threaded build of [Stockfish.js](https://github.com/nmrugg/stockfish.js) (GPLv3), a WebAssembly port of [Stockfish](https://github.com/official-stockfish/Stockfish).
