**Big Picture**
- **Stack**: This is a MERN-style app with an Express + MongoDB backend and a Create-React-App frontend in `client/`.
- **Service boundaries**: Backend exposes a single API prefix `POST/GET /api/*` (see `server.js` and `routes/`). The frontend runs separately under `client/` and uses a `proxy` to `http://localhost:8080` during development (`client/package.json`).
- **Realtime**: Socket.IO is attached to the same HTTP server via `socketServer.js`. Important socket events include `joinUser`, `joinAdmin`, `likePost`, `createComment`, `createNotify`, and `addMessage` (see `socketServer.js`).

**How to run (developer)**
- **Start backend (dev)**: use `npm run dev` from repo root — this runs `nodemon server.js` (see root `package.json`).
- **Start frontend (dev)**: `cd client && npm start` — CRA dev server proxies API requests to the backend.
- **Env vars**: `MONGODB_URL`, `PORT` (defaults to `8080`), `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET` are required by the server (refer to `server.js` and `controllers/*`).

**Auth & cookies**
- **Token flow**: Access tokens are JWTs in the `Authorization` header. The refresh token is stored in an HTTP cookie named `refreshtoken` and refreshed at `POST /api/refresh_token` (see `authCtrl.generateAccessToken`).
- **Middleware**: `middleware/auth.js` expects the full token in `Authorization` header and attaches `req.user` for controllers.

**API patterns & conventions**
- **Route layout**: Routes live in `routes/` and are mounted at `/api` in `server.js` (e.g. `routes/postRouter.js` defines endpoints under `/api/posts`, `/api/post/:id`, etc.).
- **Controller responses**: Controllers commonly return `{ msg: string, ... }` and prefer `res.json()` over custom wrappers. Many endpoints return `msg` and resource data (e.g. `newPost`).
- **Pagination helper**: `controllers/postCtrl.js` contains a small `APIfeatures` utility for `page` and `limit` query params. Follow this pattern when adding list endpoints.

**Socket patterns**
- **Where**: `socketServer.js` contains the socket logic. The server calls `SocketServer(socket)` on each connection.
- **Who receives events**: The server tracks `users` and `admins` arrays with `{ id, socketId }` and emits to specific socketIds (not broadcast). Mirror this approach if adding socket events.

**Project structure highlights**
- **Backend**: `controllers/` (business logic), `routes/` (route wiring), `models/` (Mongoose schemas), `middleware/` (auth), `socketServer.js` (realtime logic).
- **Frontend**: `client/src/` contains components, `client/src/redux` contains `store.js`, actions and reducers. Many components expect API shapes returned by the backend (e.g. `user` objects with `followers`, `following`, `avatar`, `username`).

**Typical integration examples**
- **Create post**: Client sends `POST /api/posts` with `{ content, images }` and `Authorization` header. Backend responds with `newPost` and `msg` (see `postCtrl.createPost`).
- **Like flow**: Client calls `PATCH /api/post/:id/like`, backend updates DB and the socket handler emits `likeToClient` to followers (see `socketServer.js` and `postCtrl.likePost`).

**Conventions & gotchas**
- **Auth header**: Middleware reads `Authorization` directly — ensure token string (e.g. `Bearer <token>` or raw token depending on client) matches how frontend sets it.
- **Cookies**: Refresh token cookie path is `/api/refresh_token` — cookie clearing and setting rely on this path in `authCtrl`.
- **Mongoose options**: Connection uses `useCreateIndex`, `useFindAndModify:false` and other options in `server.js`. Keep these when changing DB connection logic.
- **Error responses**: Controllers return `res.status(400).json({ msg: '...' })` for client errors and `res.status(500).json({ msg: err.message })` for server errors. Follow this format for consistent error handling.

**Files to inspect when changing features**
- **Add/modify APIs**: update `routes/*.js` and `controllers/*Ctrl.js`.
- **Auth changes**: `middleware/auth.js`, `controllers/authCtrl.js`.
- **Realtime changes**: `socketServer.js` for events, `client/src/SocketClient.js` for client-side events.
- **Frontend UI/Redux**: `client/src/components/`, `client/src/pages/`, and `client/src/redux/`.

**If you need to run tests or builds**
- Frontend: `cd client && npm run build` for production bundle.
- Backend: there are no automated tests present; manual testing via Postman or by running the app is expected.

If anything above is unclear or you want additional examples (e.g., example request/response JSON for a specific endpoint), tell me which endpoint or area to expand and I will iterate.
