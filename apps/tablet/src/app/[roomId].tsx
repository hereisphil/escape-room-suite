import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@global-client-auth";
import { ActivityIndicator, Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useEffect, useState } from "react";
import type { EscapeRoomType } from "@global-types";
import { colors, radius } from "@global-theme";

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

    if (!rooms || !roomId || !escapeRoom) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.badge, isStarted && styles.badgeLive]}>
                    <View style={[styles.dot, isStarted && styles.dotLive]} />
                    <Text
                        style={[
                            styles.badgeText,
                            isStarted && styles.badgeTextLive,
                        ]}
                    >
                        {isStarted ? "Live" : "Standby"}
                    </Text>
                </View>
                <Text style={styles.eyebrow}>Welcome to</Text>
                <Text style={styles.title}>{escapeRoom.name}</Text>
                <Text style={styles.summary}>{escapeRoom.summary}</Text>
            </View>

            <View style={styles.statusCard}>
                {isStarted ? (
                    <>
                        <Ionicons
                            name="timer-outline"
                            size={40}
                            color={colors.primary}
                        />
                        <Text style={styles.statusTitle}>
                            The clock is running
                        </Text>
                        <Text style={styles.timer}>60:00</Text>
                    </>
                ) : (
                    <>
                        <ActivityIndicator
                            size="large"
                            color={colors.primary}
                        />
                        <Text style={styles.statusTitle}>Waiting to start</Text>
                        <Text style={styles.statusText}>
                            Your game master will start the countdown when
                            everyone is ready.
                        </Text>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 24,
        gap: 16,
    },
    header: {
        gap: 4,
    },
    badge: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 999,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginBottom: 12,
    },
    badgeLive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.mutedForeground,
    },
    dotLive: {
        backgroundColor: colors.destructive,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 1,
        textTransform: "uppercase",
        color: colors.mutedForeground,
    },
    badgeTextLive: {
        color: colors.primaryForeground,
    },
    eyebrow: {
        fontSize: 14,
        color: colors.mutedForeground,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: colors.foreground,
    },
    summary: {
        fontSize: 14,
        color: colors.mutedForeground,
        lineHeight: 20,
        marginTop: 4,
    },
    statusCard: {
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.xl,
        padding: 24,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.cardForeground,
        marginTop: 8,
    },
    statusText: {
        fontSize: 14,
        color: colors.mutedForeground,
        textAlign: "center",
        lineHeight: 20,
    },
    timer: {
        fontSize: 64,
        fontWeight: 600,
        color: colors.primary,
    },
});
