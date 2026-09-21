import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@global-client-auth";
import { colors, radius } from "@global-theme";

export default function Home() {
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
            <Text style={styles.title}>Connected</Text>

            {rooms?.map((room) => (
                <Text key={room.id} style={styles.room}>
                    {room.name}
                </Text>
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
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.foreground,
    },
    room: {
        color: colors.mutedForeground,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: radius.md,
        marginTop: 16,
    },
    buttonText: {
        color: colors.primaryForeground,
    },
});
