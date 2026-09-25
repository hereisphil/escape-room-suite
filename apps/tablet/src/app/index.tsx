import {
    ActivityIndicator,
    StyleSheet,
    Text,
    Pressable,
    View,
    ScrollView,
} from "react-native";
import { useAuth } from "@global-client-auth";
import { colors, radius } from "@global-theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function App() {
    const { rooms, logout } = useAuth();

    if (!rooms) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.eyebrow}>Staff setup</Text>
                <Text style={styles.title}>Select a room</Text>
                <Text style={styles.subTitle}>
                    Choose the room this tablet will be used in, then place it
                    in that room.
                </Text>
            </View>
            <ScrollView
                style={styles.list}
                contentContainerStyle={styles.listContent}
            >
                {rooms.map((room) => (
                    <Link
                        key={room.id}
                        href={{
                            pathname: "/[roomId]",
                            params: { roomId: room.id },
                        }}
                        asChild
                    >
                        <Pressable
                            style={({ pressed }) => [
                                styles.roomCard,
                                pressed && styles.roomCardPressed,
                            ]}
                        >
                            <View style={styles.roomCardHeader}>
                                <Text style={styles.roomSlug}>{room.slug}</Text>
                                <Text style={styles.roomChevron}>›</Text>
                            </View>
                            <Text style={styles.roomName}>{room.name}</Text>
                            <Text style={styles.roomSummary} numberOfLines={2}>
                                {room.summary}
                            </Text>
                        </Pressable>
                    </Link>
                ))}
            </ScrollView>
            <Pressable style={styles.logoutBtn} onPress={logout}>
                <Text style={styles.logoutBtnText}>Logout</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    header: {
        width: "100%",
        paddingHorizontal: 24,
        paddingTop: 16,
        gap: 4,
    },
    eyebrow: {
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 1.5,
        textTransform: "uppercase",
        color: colors.mutedForeground,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.foreground,
    },
    subTitle: {
        fontSize: 14,
        color: colors.mutedForeground,
        lineHeight: 20,
    },
    list: {
        width: "100%",
        maxWidth: 800,
    },
    listContent: {
        padding: 24,
        gap: 48,
    },
    roomCard: {
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.xl,
        padding: 16,
        gap: 4,
    },
    roomCardPressed: {
        backgroundColor: colors.secondary,
    },
    roomCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    roomSlug: {
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 1,
        textTransform: "uppercase",
        color: colors.mutedForeground,
    },
    roomChevron: {
        fontSize: 22,
        lineHeight: 22,
        color: colors.mutedForeground,
    },
    roomName: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.cardForeground,
    },
    roomSummary: {
        fontSize: 13,
        color: colors.mutedForeground,
        lineHeight: 18,
    },
    logoutBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: radius.md,
        marginTop: 8,
        marginBottom: 16,
    },
    logoutBtnText: {
        color: colors.primaryForeground,
        fontWeight: "600",
    },
});
