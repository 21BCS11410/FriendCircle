Client (React)

This folder contains the Create React App frontend for FriendCircle.

## Quick Start
From repo root, run frontend:

```powershell
cd client
npm install
npm start
```

The CRA dev server proxies API requests to `http://localhost:8080` (see `client/package.json` `proxy`).

## Scripts
- `npm start` — start dev server
- `npm run build` — production build
- `npm test` — run tests (CRA)

## Project layout (high level)
- `src/` — main app source
	- `components/` — reusable UI components (posts, comments, header, message views and admin dashboard subfolders)
	- `pages/` — route pages (`home`, `login`, `register`, `profile`, `post`, `message`)
	- `redux/` — `store.js`, actions and reducers
	- `SocketClient.js` — client socket wrapper and event bindings

## Important notes for contributors
- The frontend expects API responses shaped like those in `controllers/*Ctrl.js` (e.g. `{ msg, access_token, user }` for auth, `posts` arrays, `notifies` etc.).
- Realtime integration: `SocketClient.js` connects to server and listens/emits events matching `socketServer.js` events. Mirror event names and payload shapes when adding features.
- Authentication: frontend stores access token in Redux and sets `Authorization` header for API calls. Refresh token is handled by the server via cookie; the client should call `/api/refresh_token` when needed.

If you want a CONTRIBUTING or UI component guide added here (style rules, lint, or preferred component patterns), tell me what you'd like documented and I will add it.

