# Project Check-In 2

**Student:** Phillip Cantu  
**Course:** WDV3421-O Connected Devices and Applications  
**Project:** Escape Room Suite

---

Weekly Status Update  
Project: Escape Room Suite

Completed This Week

- Built the tablet app for real: sign-in, room select, then a Standby / Live room screen (`apps/tablet/src/app/index.tsx`, `apps/tablet/src/app/[roomId].tsx:10-87`).
- Pulled shared sign-in and keyboard layout into a new `@global-client-ui` package so mobile and tablet use the same screens (`packages/client-ui/src/SignInScreen.tsx`, `packages/client-ui/src/KeyboardLayout.tsx`).
- Fixed native apps missing `room:load` by listening in `AuthProvider` before connect, so rooms are a single source of truth for web, mobile, and tablet (`packages/client-auth/src/index.tsx:136-140`).
- Added a `room:start` Socket.IO event. The bug was `socket.emit` vs `io.emit` — `io.emit` is what actually broadcasts to every client (`packages/types/src/index.ts:33,41`, `apps/server/src/index.ts:102-106`).
- Web admin can start a countdown, mark rooms Live vs Standby, and switch between them (`apps/web/src/components/StartCountdown.tsx:45-54`, `apps/web/src/App.tsx:38-47,99-115`).
- Rehauled mobile to match tablet: sign-in, pick a room, then locked Home / Scan / Help tabs that keep the room in context (`apps/mobile/src/app/index.tsx`, `apps/mobile/src/lib/room-context.tsx:27-62`, `apps/mobile/src/app/[roomId]/`).
- Styled all three clients, added two README screenshots of the three-device start flow, and tested web + tablet (Expo web on :8082) + mobile (Expo Go) together.

Planned for Next Week

- Replace the tablet's hardcoded `60:00` label with a real timer. Research whether all three apps can stay in sync, with web as the source of truth (`apps/tablet/src/app/[roomId].tsx:72`).
- Add an admin PIN so customers cannot accidentally logout or switch rooms on tablet and mobile.
- Wire web Send Message so it shows as an alert on tablet and mobile (haptics + sound), including interrupting whichever mobile tab is open.

Blockers & Support Needed

- No hard blocker. Login, room select, and `room:start` across web, tablet, and mobile are working.
- The tablet clock is still a static `60:00` — it does not count down yet.
- Send Message still echoes back to the sender only (`apps/server/src/index.ts:97-100`). Fine for proving the event exists, not ready for a live game-master nudge.

Notes

- I will not spend more time on styling. The current UI is good enough.
- Voice from web admin to the tablet (and back) is an ambitious later goal, not next week's work.
