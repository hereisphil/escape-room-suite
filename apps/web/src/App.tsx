import LoginForm from "./components/LoginForm";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SendMessage } from "./components/SendMessage";
import { useAuth, useCountdown } from "@global-client-auth";

import { type EscapeRoomType, type RoomCountdown } from "@global-types";
import { ChevronRightIcon } from "lucide-react";
import { StartCountdown } from "./components/StartCountdown";

function countdownFor(countdowns: RoomCountdown[], roomId: number) {
  return countdowns.find((item) => item.roomId === roomId) ?? null;
}

function LiveClock({ endsAt, large = false }: { endsAt: number; large?: boolean }) {
  const { label } = useCountdown(endsAt);
  return (
    <span className={large ? "text-5xl font-semibold tabular-nums tracking-tight" : "tabular-nums"}>
      {label}
    </span>
  );
}

function App() {
  // The socket and the login logic from shared global AuthProvider
  const {
    socket,
    isLoggedIn,
    isConnecting,
    authError,
    login,
    logout,
    rooms,
    countdowns,
  } = useAuth();
  const [currentRoom, setCurrentRoom] = useState<EscapeRoomType>();

  const isRoomLive = (roomId: EscapeRoomType["id"]) =>
    countdownFor(countdowns, roomId) !== null;

  const currentCountdown = currentRoom
    ? countdownFor(countdowns, currentRoom.id)
    : null;
  const isCurrentRoomLive = currentCountdown !== null;

  if (!isLoggedIn || !socket) {
    return (
      <main className="flex justify-center items-center">
        <section className="grow max-w-xl flex flex-col items-center">
          <LoginForm
            onLogin={login}
            isLoading={isConnecting}
            errorMessage={authError}
          />
          <div className="rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground shadow-sm w-full max-w-sm tracking-wider">
            <p className="mt-1 font-bold">
              Use the following account to log in:
            </p>
            <div className="mt-2 space-y-1">
              <p>
                <span className="font-medium">Username:</span>{" "}
                <span className="font-mono">gamemaster</span>
              </p>
              <p>
                <span className="font-medium">Password:</span>{" "}
                <span className="font-mono">password123</span>
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="py-6 px-2">
      <header className="flex justify-between p-2 mb-4">
        <Select<EscapeRoomType>
          value={currentRoom ?? null}
          onValueChange={(selectedRoom) =>
            setCurrentRoom(selectedRoom ?? undefined)
          }
          itemToStringValue={(room) => String(room.id)}
          itemToStringLabel={(room) => room.slug}
          isItemEqualToValue={(a, b) => a.id === b.id}
        >
          <SelectTrigger className="max-w-full">
            <SelectValue className="max-w-full" placeholder="Select a room" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {rooms?.map((room) => (
              <SelectItem key={room.id} value={room}>
                <span
                  aria-hidden
                  className={
                    isRoomLive(room.id)
                      ? "size-2 rounded-full bg-destructive"
                      : "size-2 rounded-full border border-muted-foreground"
                  }
                />
                {room.slug}
                <span className="text-xs text-muted-foreground">
                  {isRoomLive(room.id) ? "Live" : "Standby"}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <h1>Web Admin</h1>
        <Button onClick={logout}>Logout</Button>
      </header>
      <section className="flex items-center justify-center">
        {currentRoom ? (
          <Card className="relative mx-auto w-full max-w-3xl pt-0">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
              src="https://avatar.vercel.sh/shadcn1"
              alt="Event cover"
              className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />
            <CardHeader>
              <CardAction>
                <Badge variant={isCurrentRoomLive ? "default" : "outline"}>
                  <span
                    className={`w-2 h-2 rounded-2xl ${isCurrentRoomLive ? "bg-destructive" : "bg-accent"}`}
                  ></span>
                  {isCurrentRoomLive ? "Live" : "Standby"}
                </Badge>
              </CardAction>
              <CardTitle>{currentRoom.slug}</CardTitle>
              <CardDescription>{currentRoom.summary}</CardDescription>
            </CardHeader>
            {currentCountdown ? (
              <p className="px-6 text-center">
                <LiveClock endsAt={currentCountdown.endsAt} large />
              </p>
            ) : null}
            <CardFooter className="flex justify-around">
              <SendMessage
                roomId={currentRoom.id}
                roomName={currentRoom.name}
                socket={socket}
              />
              <StartCountdown
                roomName={currentRoom.name}
                roomId={currentRoom.id}
                socket={socket}
                isLive={isCurrentRoomLive}
              />
            </CardFooter>
          </Card>
        ) : (
          <div className="w-full max-w-3xl px-2">
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Staff setup
              </p>
              <h2 className="mt-1 text-3xl font-bold">Select a room</h2>
              <p className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground">
                Choose the room you are running. When everyone is ready, open
                that room and start the countdown.
              </p>
            </div>
            {!rooms ? (
              <p className="text-sm text-muted-foreground">Loading rooms…</p>
            ) : (
              <div className="flex flex-col gap-3">
                {rooms.map((room) => {
                  const live = isRoomLive(room.id);
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setCurrentRoom(room)}
                      className="rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary"
                    >
                      <span className="flex items-center justify-between">
                        <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                          {room.slug}
                        </span>
                        <ChevronRightIcon className="size-5 text-muted-foreground" />
                      </span>
                      <span className="mt-1 block text-lg font-semibold">
                        {room.name}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-sm leading-snug text-muted-foreground">
                        {room.summary}
                      </span>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span
                          className={
                            live
                              ? "size-2 rounded-full bg-destructive"
                              : "size-2 rounded-full border border-muted-foreground"
                          }
                        />
                        {live ? "LIVE" : "STANDBY"}
                        {live ? (
                          <LiveClock
                            endsAt={countdownFor(countdowns, room.id)!.endsAt}
                          />
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
