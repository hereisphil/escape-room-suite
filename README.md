# CDA Project

## Escape Room Suite

An interconnected monorepo with 3 apps: Web, Mobile, and Tablet. A Bun + Express + Socket.io server. And shared types, auth, client-auth, and a theme.

**Student:** Phillip Cantu<br />
**Assignment:** CDA Project<br />
**Full Sail University**<br />
**WDV3421-O Connected Devices and Applications**<br />

Main Technologies used:

- [Bun](https://bun.sh/)
- [Turborepo](https://turborepo.dev/)
- React + Tailwind
- React Native / Expo
- Express
- [Socket.io](https://socket.io/)

## Workspaces

1. Apps
    - web (React): Administrative dashboard.
    - mobile (React Native): Escape Room customer interactions.
    - tablet (React Native): Escape Room's timer, alarms, and notifications.
    - server (Bun/Express.js/Socket.io): Connecting all the apps together.

2. Packages
    - types: TS Type Exports including Socket.io defined events.
    - auth: Used by Socket.io middleware to validate.
    - client-auth: React Context used by web, mobile, and tablet.
    - theme: shared colors and radius (Web is source of truth)

## THE HOW-TO BEGINS HERE 🤩

### Requirements

- [Bun](https://bun.sh)
- [Expo Go](https://expo.dev/go) to test mobile and tablet on a device

### Installation

```bash
git clone https://github.com/hereisphil/escape-room-suite.git
cd escape-room-suite
bun install
```

### Theme tokens

After changing colors or radius in the web app's CSS, regenerate native tokens:

```bash
bun run --filter @global-theme generate
```

_`bun run --filter @global-theme generate` uses `culori` to convert the web app's oklch colors and radii into values React Native can use._

### SERVER_URL fallback

`SERVER_URL` in `packages/types/src/index.ts` is a fallback when the LAN host cannot be inferred. Web uses the page hostname, and mobile uses Expo's `hostUri`. If a native client still cannot reach the server, set it to your local IP. On macOS you can check that with `ipconfig getifaddr en0` (or `en4` if connected via a dock/Ethernet like myself).

## Run all apps via Turborepo

```bash
bun run dev
```

Uses Turborepo to run every `package.json`'s `dev` script in all apps including: server, web, tablet, and mobile.

- **Web:** <http://localhost:5173/>
- **Mobile:** Use Expo Go (default Expo port 8081)
- **Tablet:** Use Expo Go (Expo port 8082, so it can run alongside mobile)
- **Server:** <http://localhost:3001/> + Watch terminal for notifications/console.logs

### Demo accounts

- Admin: `gamemaster` / `password123`
- Player: `detective` / `password123`

Test the mobile app via your iOS/Android simulators or, what I use, the Expo Go mobile application, which is what I recommend and you can get that here:

- iOS (USA): <https://apps.apple.com/us/app/expo-go/id982107779>
- Android (USA): <https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&pli=1>

## Screenshots

> 2026.09.24 Addding two simple screenshots, I do plan to add a walkthrough video when complete.

**#1 Web Admin ready to start the rooms. Tablet & Mobile are waiting.**

![waiting-to-start](/screenshots/2026Sep24_waiting-to-start.png)

**#2 Web Admin started the rooms!**

![started](/screenshots/2026Sep24_started.png)
