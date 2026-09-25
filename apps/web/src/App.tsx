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
import { useAuth } from "@global-client-auth";

import { type EscapeRoomType } from "@global-types";
import { StartCountdown } from "./components/StartCountdown";

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
    } = useAuth();
    const [currentRoom, setCurrentRoom] = useState<EscapeRoomType>();
    const [liveRoomIds, setLiveRoomIds] = useState<Set<EscapeRoomType["id"]>>(
        () => new Set(),
    );

    const isRoomLive = (roomId: EscapeRoomType["id"]) =>
        liveRoomIds.has(roomId);

    const handleGoLive = (roomId: EscapeRoomType["id"]) => {
        setLiveRoomIds((prev) => new Set(prev).add(roomId));
    };

    const isCurrentRoomLive = currentRoom ? isRoomLive(currentRoom.id) : false;

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
                        <SelectValue
                            className="max-w-full"
                            placeholder="Select a room"
                        />
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
                                <Badge
                                    variant={
                                        isCurrentRoomLive
                                            ? "default"
                                            : "outline"
                                    }
                                >
                                    <span
                                        className={`w-2 h-2 rounded-2xl ${isCurrentRoomLive ? "bg-destructive" : "bg-accent"}`}
                                    ></span>
                                    {isCurrentRoomLive ? "Live" : "Standby"}
                                </Badge>
                            </CardAction>
                            <CardTitle>{currentRoom.slug}</CardTitle>
                            <CardDescription>
                                {currentRoom.summary}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-around">
                            <SendMessage
                                roomName={currentRoom.name}
                                socket={socket}
                            />
                            <StartCountdown
                                roomName={currentRoom.name}
                                roomId={currentRoom.id}
                                socket={socket}
                                isLive={isCurrentRoomLive}
                                onStart={handleGoLive}
                            />
                        </CardFooter>
                    </Card>
                ) : (
                    <h2 className="bg-accent rounded-sm py-4 px-2">
                        Select a Room to View.
                    </h2>
                )}
            </section>
        </main>
    );
}

export default App;
