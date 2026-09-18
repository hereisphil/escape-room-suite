import { io, Socket } from "socket.io-client";
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

import { SERVER_URL, type EscapeRoomType } from "@global-types";
import type { LoginCredentials } from "@/components/LoginForm";

const EscapeRooms: EscapeRoomType[] = [
    {
        id: 1,
        slug: "Deep-Sea",
        name: "Deep-Sea Abyssal Research Station",
        summary:
            "A catastrophic pressure hull breach where players calibrate depth gauges, restore ballast integrity, and decode bioluminescent sonar signals to surface before oxygen depletion.",
    },
    {
        id: 2,
        slug: "Bunker",
        name: "Decommissioned Cold War Bunker",
        summary:
            "An analog-to-digital missile silo lockdown where players patch rotary dial circuitry, cross-reference encrypted punch cards, and cycle manual radiation blast doors.",
    },
    {
        id: 3,
        slug: "Clockwork",
        name: "Abandoned Clockwork Archive",
        summary:
            "The mechanical subterranean vault of a vanished horologist, requiring players to synchronize massive brass pendulum gears, align astrolabe lenses, and wind counterweighted escapement locks.",
    },
];

function App() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [currentRoom, setCurrentRoom] = useState<EscapeRoomType>();

    const handleLogin = ({ username, password }: LoginCredentials) => {
        setAuthError(null);

        // Initialize socket with the user's input credentials
        const newSocket = io(SERVER_URL, {
            auth: { username, password },
        });

        newSocket.on("connect", () => {
            setIsAuthenticated(true);
            newSocket.emit("register-client", "web");
        });

        newSocket.on("connect_error", (err) => {
            console.log(err);
            setAuthError(err.message);
            newSocket.disconnect();
        });

        setSocket(newSocket);
        console.log(socket);
    };

    if (!isAuthenticated) {
        return (
            <main className="flex justify-center items-center">
                <section className="grow max-w-xl flex flex-col items-center">
                    <LoginForm onLogin={handleLogin} errorMessage={authError} />
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900 shadow-sm w-full max-w-sm tracking-wider">
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
                    <SelectTrigger>
                        <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                        {EscapeRooms.map((room) => (
                            <SelectItem key={room.id} value={room}>
                                {room.slug}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <h1>Web Admin</h1>
                <Button>Logout</Button>
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
                                <Badge variant="default">Live</Badge>
                            </CardAction>
                            <CardTitle>{currentRoom?.slug}</CardTitle>
                            <CardDescription>
                                {currentRoom?.summary}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-around">
                            <Button className="w-full max-w-xs">
                                View Event
                            </Button>
                            <Button className="w-full max-w-xs">
                                View Event
                            </Button>
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
