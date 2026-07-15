# 02 — Realtime Chat

A WebSocket-based chat server with rooms, presence, message history, and
backpressure handling. Ships with a minimal browser client and a Node client
for load tests.

## What it does

- Users join with a display name.
- Multiple rooms; users can join/leave any room.
- Presence updates broadcast to every user in the room.
- Messages fan out only to the sender's current rooms.
- Server enforces per-connection message rate limits.
- Slow clients get their buffered outgoing messages dropped (backpressure).
- Message history: server keeps the last 50 per room.

## Modules exercised

- **02 (functions)** — event handler composition, higher-order handlers.
- **05 (DOM)** — browser client with delegation.
- **06 (async)** — WebSocket lifecycle, cancellation.
- **08 (errors)** — protocol errors sent as typed messages, not swallowed.
- **09 (testing)** — tests connect real WebSocket clients.

## Wire protocol

Every message is a JSON object with a `type` discriminator:

```jsonc
// client → server
{ "type": "hello", "name": "ada" }
{ "type": "join",  "room": "general" }
{ "type": "leave", "room": "general" }
{ "type": "msg",   "room": "general", "text": "hi" }

// server → client
{ "type": "welcome", "userId": "u1", "rooms": [] }
{ "type": "roster",  "room": "general", "users": [{id, name}] }
{ "type": "msg",     "room": "general", "userId": "u2", "name": "grace", "text": "hi", "at": "…" }
{ "type": "history", "room": "general", "messages": [...] }
{ "type": "error",   "code": "rate_limited", "message": "slow down" }
```

## Acceptance criteria

- Server accepts connections on `PORT` (default 4000).
- Rejects clients that don't send `hello` within 5s.
- `msg` to a room the user hasn't joined → `error` back.
- Per-user rate limit: 10 messages / 5 seconds → subsequent messages are
  dropped with a `rate_limited` error.
- When a WS `send` buffer exceeds 1MB, subsequent broadcasts to that client
  are dropped and the connection is closed.
- Server never crashes on malformed input — returns `error` and stays up.

## Running

```bash
cd 02-realtime-chat
npm install                 # installs `ws`
node src/server.js          # server on :4000
open public/index.html      # or serve /public

# Load test:
node src/client-load.js 100
```

## Tests

```bash
node --test tests/
```

## Extensions

- Persist messages to SQLite; page through history.
- Per-room moderators; kick/ban.
- Presence status (typing / idle).
- End-to-end message encryption with per-room shared keys.
- Deploy on Fly.io behind their WebSocket-aware proxy.

## What "done" looks like

- [ ] Server survives a load test of 100 concurrent clients.
- [ ] Backpressure verified — slow clients are disconnected, not crashing the server.
- [ ] Tests cover happy path, rate-limited path, error protocol.
- [ ] README shows a screenshot of the browser client working.
