# CDA Project

## Escape Room Suite

> 2026.09.27 Project Finished<br />YouTube Video Walkthrough

👉 <https://www.youtube.com/watch?v=Q0pSuyiwA-I> 👈

**Student:** Phillip Cantu<br />
**Assignment:** CDA Project<br />
**Full Sail University**<br />
**WDV3421-O Connected Devices and Applications**<br />

## Project Description

- **What problem does your system solve or what experience does it create?**

The Escape Room Suite is a simple all-in-one system for owners of Escape Rooms. It create an interconnected experience of a server, web admin dashboard, room tablet, and client mobile app.

- **Who would use this system and in what context?**

The owners of Escape Room businesses would use this to help easily manage each of their rooms and the clients themselves will use the mobile app while within the room. The idea is that each room will contain a tablet and a mobile phone both receiving information from thew web admin, which is the source of truth.

- **What makes your approach unique or interesting?**

I believe keeping the React + Tailwind Web Admin App the source of truth is the unique approach. As a monorepo, common technologies are shared and keeping the "admin" as the source makes the most sense in this business.

## Architecture Overview

- **How do the three interfaces work together?**

**Server:** Node + Express + Socket.io is what receives and emits messages and states between each app. Such as when a room starts and ends, and any messages from the admin, which clients are connected, and even what Escape Rooms are even available.

**Web:** React + Tailwind + Shadcn/ui is the next source of truth. It determines which rooms from the server starts, and what messages are sent.

**Tablet:** React Native is a simple app to display the room timer and messages from admin.

**Mobile:** React Native is what the client will use. They'll see when the room has started, messages from admin, interact with QR codes in the room with the camera, and see a general help section.

**Packages:** This mono repo contains several shared packages, they're not app themselves, but instead include shared Types, define Socket.io Events, shared tokens based off of the web's index.css, and even Auth + React Context.

- **What is the data flow between components?**

Everything is connected via Socket.io. There are not many events currently defined but once the stack is up and running the first information that's sent is from the server to the clients, and that's the data on the escape rooms. After that, the main events are just client-to-server of when a client connects, Web to server to clients of when a room starts, and Web to server to clients of an admin message.

- **What are the key real-time interactions?**

The two most real-time interactions of room starts & room messages - both via the web admin dashboard.

## Technical Implementation

- Key technologies and libraries used
    - [Bun](https://bun.sh/)
    - [Turborepo](https://turborepo.dev/)
    - React + Tailwind
    - React Native + Expo
    - Express
    - [Socket.io](https://socket.io/)
    - [Culori](https://culorijs.org/) (converts Web's oklch colors to Hex for React Native clients)

- Notable features or technical challenges solved
    - Setting up the globally shared [Auth](packages/auth/src/index.ts) + [Client Auth](packages/client-auth/src/index.tsx) used by all 3 React apps was one of the first bieggest technical challenges solved
    - Followed by the [KeyboardLayout.tsx](packages/client-ui/src/KeyboardLayout.tsx) and [SignInScreen.tsx](packages/client-ui/src/SignInScreen.tsx) used by both React Native clients took some studying!
- Any creative solutions or innovative approaches
    - Google Gemini was my creative solution when I needed help 🤣

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
    - client-ui: React Native shared components such as Keyboard Layout.
    - theme: shared colors and radius (Web is source of truth)

---

## Setup Instructions

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
- **Tablet:** Use Expo Go (Expo port 8082, so it can run alongside mobile) **OR** <http://localhost:8082/> to view it on the web.
- **Server:** <http://localhost:3001/> (health check) + Watch terminal for notifications/console.logs

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
