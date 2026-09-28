import { useLocalSearchParams } from "expo-router";
import { useAuth, useCountdown } from "@global-client-auth";
import { showGameMasterMessage } from "@global-client-ui";
import { ActivityIndicator, Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { useEffect, useState } from "react";
import type { EscapeRoomType, RoomMessage } from "@global-types";
import { colors, radius } from "@global-theme";

const RING_SIZE = 280;
const RING_STROKE = 14;

function CountdownRing({ endsAt }: { endsAt: number }) {
    const { label, progress } = useCountdown(endsAt);
    const ringRadius = (RING_SIZE - RING_STROKE) / 2;
    const circumference = 2 * Math.PI * ringRadius;
    const center = RING_SIZE / 2;

    return (
        <View style={styles.ringWrap}>
            <Svg
                width={RING_SIZE}
                height={RING_SIZE}
                style={{ transform: [{ rotate: "-90deg" }] }}
            >
                <Circle
                    cx={center}
                    cy={center}
                    r={ringRadius}
                    stroke={colors.border}
                    strokeWidth={RING_STROKE}
                    fill="none"
                />
                <Circle
                    cx={center}
                    cy={center}
                    r={ringRadius}
                    stroke={colors.primary}
                    strokeWidth={RING_STROKE}
                    fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={circumference * (1 - progress)}
                    strokeLinecap="round"
                />
            </Svg>
            <Text style={styles.timer}>{label}</Text>
        </View>
    );
}

export default function RoomScreen() {
    const { roomId } = useLocalSearchParams<{ roomId: string }>();
    const { socket, rooms, countdowns } = useAuth();
    const [escapeRoom, setEscapeRoom] = useState<EscapeRoomType>();
    const countdown =
        countdowns.find((item) => item.roomId === Number(roomId)) ?? null;
    const isStarted = countdown !== null;

    useEffect(() => {
        const room = rooms?.find((room) => room.id === Number(roomId));
        setEscapeRoom(room);
    }, [rooms, roomId]);

    useEffect(() => {
        if (!socket || !roomId) return;

        const onMessage = (payload: RoomMessage) => {
            if (payload.roomId !== Number(roomId)) return;
            showGameMasterMessage(payload.message);
        };

        socket.on("message:received", onMessage);
        return () => {
            socket.off("message:received", onMessage);
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
                {isStarted && countdown ? (
                    <>
                        <CountdownRing endsAt={countdown.endsAt} />
                        <Text style={styles.statusTitle}>
                            The clock is running
                        </Text>
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
    ringWrap: {
        width: RING_SIZE,
        height: RING_SIZE,
        alignItems: "center",
        justifyContent: "center",
    },
    timer: {
        position: "absolute",
        fontSize: 64,
        fontWeight: "600",
        color: colors.primary,
        fontVariant: ["tabular-nums"],
    },
});
