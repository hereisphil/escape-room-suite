import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@global-client-auth";
import type { EscapeRoomType } from "@global-types";

type RoomValue = {
    room: EscapeRoomType;
    isStarted: boolean;
    latestMessage: string | null;
};

const RoomContext = createContext<RoomValue | null>(null);

export function useRoom() {
    const value = useContext(RoomContext);
    if (!value) {
        throw new Error("useRoom must be used inside a <RoomProvider>");
    }
    return value;
}

type RoomProviderProps = {
    room: EscapeRoomType;
    children: ReactNode;
};

export function RoomProvider({ room, children }: RoomProviderProps) {
    const { socket } = useAuth();
    const [isStarted, setIsStarted] = useState(false);
    const [latestMessage, setLatestMessage] = useState<string | null>(null);

    // Reset when changing rooms
    useEffect(() => {
        setIsStarted(false);
        setLatestMessage(null);
    }, [room.id]);

    useEffect(() => {
        if (!socket) return;

        const onRoomStart = (startedId: string) => {
            if (startedId !== String(room.id)) return;
            setIsStarted(true);
        };
        const onMessage = (message: string) => {
            setLatestMessage(message);
        };

        socket.on("room:start", onRoomStart);
        socket.on("message:received", onMessage);
        return () => {
            socket.off("room:start", onRoomStart);
            socket.off("message:received", onMessage);
        };
    }, [socket, room.id]);

    return (
        <RoomContext.Provider value={{ room, isStarted, latestMessage }}>
            {children}
        </RoomContext.Provider>
    );
}
