# FriendCircle (MERN Social App)

This repository contains a MERN-style social media application (backend + Create React App frontend).

## Quick Overview
- Backend: Express + MongoDB (Mongoose). Main entry: `server.js`.
- Frontend: React (Create React App) in `client/` (dev proxy to backend is configured in `client/package.json`).
- Realtime: Socket.IO attached to the same HTTP server (`socketServer.js`).

## Prerequisites
- Node.js (14+ recommended)
- MongoDB connection (Atlas or local)

## Environment Variables
Create a `.env` in the repo root with at least:

- `MONGODB_URL` — MongoDB connection string
- `PORT` — optional (defaults to `8080`)
- `ACCESS_TOKEN_SECRET` — JWT secret for access tokens
- `REFRESH_TOKEN_SECRET` — JWT secret for refresh tokens

## Run (development)
Start backend from project root:

```powershell
npm install
npm run dev
```

Start frontend in a separate terminal:

```powershell
cd client
npm install
npm start
```

## API Endpoints (mounted under `/api`)
Authentication
- `POST /api/register` — Register a new user. Body: `fullname, username, email, password, gender`.
- `POST /api/register_admin` — Register admin (similar body).
- `POST /api/login` — Login as user. Body: `email, password`. Returns `{ access_token, user }` and sets `refreshtoken` cookie.
- `POST /api/admin_login` — Login as admin.
- `POST /api/logout` — Clears refresh cookie.
- `POST /api/refresh_token` — Use refresh cookie to generate a new access token.
- `POST /api/changePassword` — (auth) Body: `{ oldPassword, newPassword }`.

Users
- `GET /api/search?username=...` — (auth) Search users (returns top 10).
- `GET /api/user/:id` — (auth) Get user profile.
- `PATCH /api/user` — (auth) Update current user's profile. Body fields: `avatar, fullname, mobile, address, story, website, gender`.
- `PATCH /api/user/:id/follow` — (auth) Follow user.
- `PATCH /api/user/:id/unfollow` — (auth) Unfollow user.
- `GET /api/suggestionsUser?num=10` — (auth) Get user suggestions.

Posts
- `POST /api/posts` — (auth) Create post. Body: `{ content, images }` (images required).
- `GET /api/posts?page=&limit=` — (auth) Feed posts (followers + self). Uses pagination util in `postCtrl`.
- `PATCH /api/post/:id` — (auth) Update post.
- `GET /api/post/:id` — (auth) Get single post.
- `DELETE /api/post/:id` — (auth) Delete post (owner only).
- `PATCH /api/post/:id/like` — (auth) Like post.
- `PATCH /api/post/:id/unlike` — (auth) Unlike post.
- `PATCH /api/post/:id/report` — (auth) Report post.
- `GET /api/user_posts/:id` — (auth) Get posts for a user.
- `GET /api/post_discover?num=` — (auth) Discover posts (random sample of posts not in following list).
- `PATCH /api/savePost/:id` — (auth) Save post to user's saved array.
- `PATCH /api/unSavePost/:id` — (auth) Remove saved post.
- `GET /api/getSavePosts` — (auth) Get saved posts (paginated).

Comments
- `POST /api/comment` — (auth) Create comment. Body: `{ postId, content, tag, reply, postUserId }`.
- `PATCH /api/comment/:id` — (auth) Update own comment. Body: `{ content }`.
- `PATCH /api/comment/:id/like` — (auth) Like comment.
- `PATCH /api/comment/:id/unlike` — (auth) Unlike comment.
- `DELETE /api/comment/:id` — (auth) Delete comment (author or post owner).

Notifications
- `POST /api/notify` — (auth) Create notification. Body: `{ id, recipients, url, text, content, image }`.
- `DELETE /api/notify/:id?url=...` — (auth) Remove a notify by id+url.
- `GET /api/notifies` — (auth) Get notifications for current user.
- `PATCH /api/isReadNotify/:id` — (auth) Mark notify as read.
- `DELETE /api/deleteAllNotify` — (auth) Delete all notifies for current user.

Messaging
- `POST /api/message` — (auth) Create message & conversation. Body: `{ recipient, text, media }`.
- `GET /api/conversations` — (auth) Get conversations (paginated).
- `GET /api/message/:id` — (auth) Get messages in conversation with user `:id`.

Admin (requires admin user role)
- `GET /api/get_total_users` — Get total user count.
- `GET /api/get_total_posts` — Get total posts count.
- `GET /api/get_total_comments` — Total comments.
- `GET /api/get_total_likes` — Total likes across posts.
- `GET /api/get_total_spam_posts` — Count of posts with many reports.
- `GET /api/get_spam_posts` — List spam/reported posts.
- `DELETE /api/delete_spam_posts/:id` — Delete spam post and its comments.

## Realtime / Socket.IO
- Socket server lives in `socketServer.js`. The server uses in-memory arrays `users` and `admins` to map application user ids to socket ids and emits targeted events.
- Common events handled: `joinUser`, `joinAdmin`, `likePost`, `unLikePost`, `createComment`, `deleteComment`, `follow`, `unFollow`, `createNotify`, `removeNotify`, `getActiveUsers`, `addMessage`.

## Conventions
- Controllers return `res.json({ msg, ... })` or resource objects. Use `res.status(400).json({ msg: '...' })` for client errors and `res.status(500).json({ msg: err.message })` for server errors.
- Routes are mounted under `/api` in `server.js`.
- Authentication: middleware reads `Authorization` header and attaches `req.user`.

## Where to change things
- Routes: `routes/*.js`
- Controllers / business logic: `controllers/*Ctrl.js`
- Socket events: `socketServer.js` and client sockets under `client/src/SocketClient.js`.
- Frontend components and Redux: `client/src/components/`, `client/src/pages/`, `client/src/redux/`.

If you want I can also add example request/response JSON for specific endpoints — tell me which endpoints to expand.
