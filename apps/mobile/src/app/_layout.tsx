import { io, Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "@global-types";
import { SERVER_URL } from "@global-types";
import { useState, useEffect } from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
            io(SERVER_URL);

        newSocket.on("connect", () => {
            newSocket.emit("client:register", "mobile");
        });
        newSocket.on("connect_error", (_err) => {
            newSocket.disconnect();
        });
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}
