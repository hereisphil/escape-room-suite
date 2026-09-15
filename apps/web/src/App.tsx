import { useState } from "react";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
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

interface room {
    roomId: number;
    shortName: string;
    fullName: string;
    summary: string;
}

const rooms: room[] = [
    {
        roomId: 1,
        shortName: "Deep-Sea",
        fullName: "Deep-Sea Abyssal Research Station",
        summary:
            "A catastrophic pressure hull breach where players calibrate depth gauges, restore ballast integrity, and decode bioluminescent sonar signals to surface before oxygen depletion.",
    },
    {
        roomId: 2,
        shortName: "Bunker",
        fullName: "Decommissioned Cold War Bunker",
        summary:
            "An analog-to-digital missile silo lockdown where players patch rotary dial circuitry, cross-reference encrypted punch cards, and cycle manual radiation blast doors.",
    },
    {
        roomId: 3,
        shortName: "Clockwork",
        fullName: "Abandoned Clockwork Archive",
        summary:
            "The mechanical subterranean vault of a vanished horologist, requiring players to synchronize massive brass pendulum gears, align astrolabe lenses, and wind counterweighted escapement locks.",
    },
];

function App() {
    const [currentRoom, setCurrentRoom] = useState<room>();

    return (
        <main className="py-6 px-2">
            <header className="flex justify-between p-2 mb-4">
                <Combobox<room>
                    items={rooms}
                    onValueChange={(selectedRoom) =>
                        setCurrentRoom(selectedRoom ?? undefined)
                    }
                    itemToStringValue={(room) => String(room.roomId)}
                    itemToStringLabel={(room) => room.shortName}
                >
                    <ComboboxInput placeholder="Select a room" />
                    <ComboboxContent>
                        <ComboboxEmpty>No rooms found.</ComboboxEmpty>
                        <ComboboxList>
                            {(room) => (
                                <ComboboxItem key={room.roomId} value={room}>
                                    {room.shortName}
                                </ComboboxItem>
                            )}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
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
                            <CardTitle>{currentRoom?.shortName}</CardTitle>
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
