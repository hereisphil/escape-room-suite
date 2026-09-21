import {
    ActivityIndicator,
    StyleSheet,
    Text,
    Pressable,
    View,
} from "react-native";
import { useState } from "react";
import type { EscapeRoomType } from "@global-types";
import { useAuth } from "@global-client-auth";
import { colors, radius } from "@global-theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
    const { rooms, logout } = useAuth();
    const [selectedRoom, setSelectedRoom] = useState<EscapeRoomType["name"]>();

    if (!rooms) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.flex}>
                {rooms.map((room) => (
                    <Pressable
                        key={room.id}
                        style={styles.roomBtn}
                        onPress={() => setSelectedRoom(room.name)}
                    >
                        <Text style={styles.roomBtnText}>{room.name}</Text>
                    </Pressable>
                ))}
            </View>
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
    flex: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    roomBtn: {
        backgroundColor: colors.secondary,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: radius.md,
    },
    roomBtnText: {
        color: colors.primary,
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
