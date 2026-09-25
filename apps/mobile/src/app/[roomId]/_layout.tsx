import { Link, Tabs, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import type { ColorValue } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import type { ComponentProps } from "react";
import { useAuth } from "@global-client-auth";
import { colors, radius } from "@global-theme";
import { RoomProvider } from "../../lib/room-context";

type IoniconName = ComponentProps<typeof Ionicons>["name"];
type TabIconProps = { color: ColorValue; focused: boolean; size: number };

function tabIcon(filled: IoniconName, outline: IoniconName) {
    return ({ color, focused, size }: TabIconProps) => (
        <Ionicons name={focused ? filled : outline} size={size} color={color} />
    );
}

export default function RoomTabsLayout() {
    const { roomId } = useLocalSearchParams<{ roomId: string }>();
    const { rooms } = useAuth();

    if (!rooms) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    const room = rooms.find((room) => room.id === Number(roomId));

    if (!room) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.notFoundTitle}>Room not found</Text>
                <Text style={styles.notFoundText}>
                    This phone isn't assigned to a valid room.
                </Text>
                <Link href="/" asChild>
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>Select a room</Text>
                    </Pressable>
                </Link>
            </SafeAreaView>
        );
    }

    return (
        <RoomProvider room={room}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.mutedForeground,
                    tabBarStyle: {
                        backgroundColor: colors.background,
                        borderTopColor: colors.border,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: "600",
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        tabBarIcon: tabIcon("home", "home-outline"),
                    }}
                />
                <Tabs.Screen
                    name="camera"
                    options={{
                        title: "Scan",
                        tabBarIcon: tabIcon("qr-code", "qr-code-outline"),
                    }}
                />
                <Tabs.Screen
                    name="help"
                    options={{
                        title: "Help",
                        tabBarIcon: tabIcon(
                            "help-circle",
                            "help-circle-outline",
                        ),
                    }}
                />
            </Tabs>
        </RoomProvider>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 24,
    },
    notFoundTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.foreground,
    },
    notFoundText: {
        fontSize: 14,
        color: colors.mutedForeground,
        textAlign: "center",
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
        fontWeight: "600",
    },
});
