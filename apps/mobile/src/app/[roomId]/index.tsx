import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { colors, radius } from "@global-theme";
import { useRoom } from "../../lib/room-context";

export default function RoomHomeScreen() {
    const { room, isStarted, latestMessage } = useRoom();

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
                <Text style={styles.title}>{room.name}</Text>
                <Text style={styles.summary}>{room.summary}</Text>
            </View>

            <View style={styles.statusCard}>
                {isStarted ? (
                    <>
                        <Ionicons
                            name="lock-open-outline"
                            size={40}
                            color={colors.primary}
                        />
                        <Text style={styles.statusTitle}>
                            The clock is running
                        </Text>
                        <Text style={styles.statusText}>
                            Find the QR codes hidden around the room and scan
                            them with the Scan tab to unlock puzzles.
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

            {latestMessage ? (
                <View style={styles.messageCard}>
                    <Text style={styles.messageLabel}>
                        From your game master
                    </Text>
                    <Text style={styles.messageText}>{latestMessage}</Text>
                </View>
            ) : null}
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
    messageCard: {
        backgroundColor: colors.muted,
        borderRadius: radius.lg,
        padding: 16,
        gap: 4,
    },
    messageLabel: {
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 1,
        textTransform: "uppercase",
        color: colors.mutedForeground,
    },
    messageText: {
        fontSize: 15,
        color: colors.foreground,
        lineHeight: 22,
    },
});
