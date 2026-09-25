# Project Check-In 1

**Student:** Phillip Cantu  
**Course:** WDV3421-O Connected Devices and Applications  
**Assignment:** Weekly Status Update Practice  
**Project:** Escape Room Suite

---

## Part I: Understanding the Status Update Format

From my understanding, a professional status updates follow a three-part structure so a manager, client, or instructor can see the whole picture without having to dig through my commits on GitHub. The three parts are:

1. **What I've Accomplished** — specific features, fixes, and learning with file references and measurable outcomes.
2. **What I'm Working On Next** — ranked upcoming deliverables (what, not when).
3. **Blockers & Support Needed** — current obstacles, missing information, or resource issues. If there are none, say so.

This check-in covers all Escape Room Suite work so far, from the Bun + Turborepo scaffold on Sep 14 through the shared theme package and README on Sep 20 (28 commits total).

---

## Part II: Weekly Status Update

**Project:** Escape Room Suite — React / React Native / Bun + Express + Socket.IO monorepo

### Completed This Week

- Initialized a Bun + Turborepo monorepo with four apps (`web`, `mobile`, `tablet`, `server`) and four packages (`types`, `auth`, `client-auth`, `theme`). `bun run dev` at the root starts every app via Turbo (`package.json:16-18`, `turbo.json:8-11`). I chose Turborepo because I already use it in my Full Sail capstone, so I knew its utlity, but I wanted and needed more practice. I use Bun for blazing-fast `bun install` / `bun add` / `bun create` / `bunx`, plus automatic TypeScript compiling and a builtin watcher (`bun --watch` on the server).
- Scaffolded the web admin in Vite + React + Tailwind + shadcn/ui, including login, room select, and a live room card (`apps/web/src/App.tsx:25-136`, `apps/web/src/components/LoginForm.tsx:20-33`). Verified at <http://localhost:5173>.
- Scaffolded Expo mobile and tablet apps, put tablet on Expo port 8082 so both can run under Turbo, and confirmed both load in Expo Go on iOS (`apps/tablet/package.json:16-17`).
- Setup a Bun + Express + Socket.IO server on port 3001 that listens on `0.0.0.0`, logs LAN IPs, tracks connected clients by type, and serves a health route (`apps/server/src/index.ts:59-68`, `121-137`). Seeded 3 escape rooms from the server that emits them on connect via `room:load` (`apps/server/src/index.ts:16-38`, `85-88`).
- Implemented Socket.IO `io.use` auth middleware. Handshake credentials go through `authenticate()`, unauthorized sockets are rejected, and the user is stored on `socket.data` (`apps/server/src/index.ts:73-83`). The middleware itself was surprisingly easy, and sending credentials from a client was too (`packages/client-auth/src/index.tsx:126-128`).
- Extracted server-side auth into `@global-auth` with 2 static demo accounts (`gamemaster` / admin, `detective` / player) (`packages/auth/src/index.ts:7-37`).
- Extracted client login + socket lifecycle into `@global-client-auth` so web and mobile share one `AuthProvider` / `useAuth` instead of duplicating connection logic (`packages/client-auth/src/index.tsx:106-195`). Web wraps the tree in `apps/web/src/main.tsx:10-12`, mobile uses Expo Router guards in `apps/mobile/src/app/_layout.tsx:18-40`. That extraction was the hard part, and so I had to rely on AI assistance to get the package split, context, and reconnect/logout flow right.
- Defined shared Socket.IO event types so server and clients agree on `room:load`, `message:send` / `message:received`, `client:register`, and `admin:error` (`packages/types/src/index.ts:26-48`).
- Built the web admin Send Message dialog (shadcn Dialog + Field + Toast) that emits `message:send` and surfaces success/error toasts (`apps/web/src/components/SendMessage.tsx:48-57`).
- Built the mobile player flow: sign-in with clipboard helpers for demo credentials (`apps/mobile/src/app/sign-in.tsx:21-46`), a connected home screen that lists rooms from `room:load` (`apps/mobile/src/app/(tabs)/home.tsx:8-39`), and a QR camera/scanner with haptic feedback plus a scan-lock ref so barcode events do not fire repeatedly (`apps/mobile/src/app/(tabs)/camera.tsx:10-31`).
- Wrapped the entire mobile app in `KeyboardLayout` using `KeyboardAvoidingView` + `TouchableWithoutFeedback` so the keyboard slides the screen and tapping empty space dismisses it (`apps/mobile/src/components/KeyboardLayout.tsx:15-29`, used in `apps/mobile/src/app/_layout.tsx:19-21`). I was super excited to learn these APIs and I am still surprised how many live production apps skip this.
- Stopped hardcoding the LAN IP as the only way to reach the server. Web resolves `window.location.hostname` (`packages/client-auth/src/index.tsx:13-26`); mobile uses Expo `hostUri` (`apps/mobile/src/app/_layout.tsx:9-12`); `SERVER_URL` in `@global-types` is now a fallback (`packages/types/src/index.ts:1-6`). The server also prints every LAN IPv4 on boot (`apps/server/src/index.ts:108-126`).
- Persisted web login across refresh with `sessionStorage` (`packages/client-auth/src/index.tsx:28-73`, `172-174`). Native skips storage because `sessionStorage` is browser-only.
- Added `@global-theme`: web `index.css` is the source of truth; a `culori` script converts oklch colors and radius tokens into React Native-safe hex/points (`packages/theme/scripts/generate-tokens.ts:1-100`). Current output is 16 color tokens and 7 radius sizes, already used on mobile sign-in, home, and camera (`packages/theme/src/tokens.ts:5-37`).
- Cleaned unused shadcn pieces (ComboBox, input-group) and unused CSS tokens/dark styles so the theme pipeline stays small. Rewrote the root README with the correct clone URL, demo accounts, Expo ports, and setup steps.

### Planned for Next Week

1. **Tablet app (highest priority).** Replace the Expo starter (`apps/tablet/App.tsx`) with the timer / alarms / notifications surface. Wire it to `@global-client-auth` and `@global-theme` the same way mobile is wired, including `clientType: "tablet"`.
2. **Expand Socket.IO events.** The current set is enough to log in, load 3 rooms, and echo a message back to the sender. Next is real room state that all three clients can share (start/stop, timer ticks, alerts) typed in `@global-types` first, then handled on the server and web/mobile/tablet.
3. **Expand the web admin dashboard.** Room select + Send Message is a start. Next is actual operator controls that drive those new events (start a room, send an alarm, see live client counts from the server health payload) instead of a placeholder "View Event" button (`apps/web/src/App.tsx:123-125`).

### Blockers & Support Needed

No hard blockers right now. Web and mobile can log in against the Socket.IO auth middleware, rooms load over `room:load`, and `bun run dev` runs the suite.

### Notes

- **Auth extraction vs `io.use`:** `socket.handshake.auth` on the server and `{ auth: credentials }` on the client felt straightforward. Pulling that into `@global-auth` and `@global-client-auth` (context, connect/error/logout, session restore, per-app `clientType`) was not. I leaned on AI assistance for that packaging work and I want to keep practicing it so I can do the tablet with less help.
- **KeyboardLayout:** I did not understand that `TouchableWithoutFeedback` can only take one child, which is why wrapping the whole app failed until everything sat inside a single `View` (`apps/mobile/src/components/KeyboardLayout.tsx:21-28`). I needed AI assistance to get that layout right. Once it clicked, I was genuinely excited as this is one of my biggest gripes with production apps today that leave the keyboard covering inputs.
- **Theme:** React Native cannot parse oklch, so generating hex from web CSS with `culori` kept native off extra color libraries.

---

## Reflection Questions

1. **What was most challenging about articulating your progress?**  
   Compressing 28 commits into specific bullets without sounding like a git log. A lot of the real work was packaging and wiring which is easy to say that it's just "DX" or "setup" but were vital.

2. **How did writing this update change your perspective on your work?**  
   It reminded me that I need to immediately put in more work, and start the tablet. Web and mobile already share types, auth, and a socket but tablet is still a starter app.

3. **What would make this update more valuable to a manager or client?**  
   File paths, what is actually demoable (login, room list, send-message echo, QR scan on mobile), and an honest "not done yet" on tablet and cross-client messaging.

4. **How comfortable are you identifying and sharing blockers?**  
   Comfortable saying there are no current hard blockers, and also comfortable saying I needed AI help on the auth package split and `KeyboardLayout`. Those are not blockers anymore, but they are the places I am weakest and where I will be careful on the tablet work.
