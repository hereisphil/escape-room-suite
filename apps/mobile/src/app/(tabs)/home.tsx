import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import type { EscapeRoomType } from "@global-types";
import { useAuth } from "@global-client-auth";

export default function Home() {
    const { socket, logout } = useAuth();
    const [rooms, setRooms] = useState<EscapeRoomType[]>([]);

    useEffect(() => {
        if (!socket) return;

        socket.on("room:load", (loadedRooms) => {
            setRooms(loadedRooms);
        });

        // Stop listening if the socket changes or the screen goes away.
        return () => {
            socket.off("room:load");
        };
    }, [socket]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Connected</Text>

            {rooms.map((room) => (
                <Text key={room.id}>{room.name}</Text>
            ))}

            <Pressable style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 6,
        marginTop: 16,
    },
    buttonText: {
        color: "white",
    },
});
