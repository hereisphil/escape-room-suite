import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@global-client-auth";
import { ActivityIndicator, Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import type { EscapeRoomType } from "@global-types";
import { colors } from "@global-theme";

export default function RoomScreen() {
    const { roomId } = useLocalSearchParams<{ roomId: string }>();
    const { socket, rooms } = useAuth();
    const [escapeRoom, setEscapeRoom] = useState<EscapeRoomType>();
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const room = rooms?.find((room) => room.id === Number(roomId));
        setEscapeRoom(room);
    }, [rooms, roomId]);

    // Will only work as long as this screen is mounted when the web emits the event
    useEffect(() => {
        if (!socket) return;
        const onRoomStart = (startedId: string) => {
            if (startedId !== roomId) return;
            setIsStarted(true);
        };
        socket.on("room:start", onRoomStart);
        return () => {
            socket.off("room:start", onRoomStart);
        };
    }, [socket, roomId]);

    if (!rooms || !roomId) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {!escapeRoom ? (
                <ActivityIndicator size="large" />
            ) : (
                <View>
                    <Text>Welcome to {escapeRoom.name}</Text>
                    {isStarted ? (
                        <View style={[styles.timer, styles.center]}>
                            <Text style={styles.timerText}>60:00</Text>
                        </View>
                    ) : (
                        <Text>Waiting to start</Text>
                    )}
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        gap: 8,
    },
    center: {
        alignItems: "center",
        justifyContent: "center",
    },
    timer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "red",
        borderColor: colors.border,
        width: 200,
        height: 200,
        padding: 150,
        borderRadius: "50%",
        marginTop: 12,
        marginBottom: 12,
    },
    timerText: {
        flex: 1,
        fontSize: 64,
        fontWeight: 600,
        color: colors.primary,
    },
});
