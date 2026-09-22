import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@global-client-auth";
import { ActivityIndicator, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import type { EscapeRoomType } from "@global-types/src";
import { colors, radius } from "@global-theme";

export default function RoomScreen() {
    // Grab id from params and convert to number
    const { roomId } = useLocalSearchParams();
    const id = Number(roomId);
    const { rooms, logout } = useAuth();
    // Find the room from the id passed
    const [escapeRoom, setEscapeRoom] = useState<EscapeRoomType>();
    useEffect(() => {
        const room = rooms?.find((room) => room.id === id);
        setEscapeRoom(room);
    }, []);

    if (!rooms || !id) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {!escapeRoom ? (
                <ActivityIndicator size="large" />
            ) : (
                <Text>Welcome to {escapeRoom?.name}</Text>
            )}
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
    logoutBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: radius.md,
        marginTop: 16,
        marginBottom: 16,
    },
    logoutBtnText: {
        color: colors.primaryForeground,
    },
});
