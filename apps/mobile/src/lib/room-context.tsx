import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { showGameMasterMessage } from "@global-client-ui";
import { useAuth } from "@global-client-auth";
import type { EscapeRoomType, RoomMessage } from "@global-types";

type RoomValue = {
    room: EscapeRoomType;
    isStarted: boolean;
    endsAt: number | null;
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
    const { socket, countdowns } = useAuth();
    const [latestMessage, setLatestMessage] = useState<string | null>(null);
    const countdown =
        countdowns.find((item) => item.roomId === room.id) ?? null;

    useEffect(() => {
        setLatestMessage(null);
    }, [room.id]);

    useEffect(() => {
        if (!socket) return;

        const onMessage = (payload: RoomMessage) => {
            if (payload.roomId !== room.id) return;
            setLatestMessage(payload.message);
            showGameMasterMessage(payload.message);
        };

        socket.on("message:received", onMessage);
        return () => {
            socket.off("message:received", onMessage);
        };
    }, [socket, room.id]);

    return (
        <RoomContext.Provider
            value={{
                room,
                isStarted: countdown !== null,
                endsAt: countdown?.endsAt ?? null,
                latestMessage,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
}
