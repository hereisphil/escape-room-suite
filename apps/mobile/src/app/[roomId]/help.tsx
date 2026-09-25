import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import type { ComponentProps } from "react";
import { colors, radius } from "@global-theme";
import { useRoom } from "../../lib/room-context";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

const STEPS: { icon: IoniconName; title: string; text: string }[] = [
    {
        icon: "time-outline",
        title: "Wait for the clock",
        text: "The Home tab shows Standby until your game master starts the countdown.",
    },
    {
        icon: "search-outline",
        title: "Explore the room",
        text: "QR codes are hidden on props, panels, and puzzles throughout the room.",
    },
    {
        icon: "qr-code-outline",
        title: "Scan to unlock",
        text: "Open the Scan tab and line a code up inside the frame to unlock its puzzle.",
    },
    {
        icon: "chatbubble-ellipses-outline",
        title: "Stuck?",
        text: "Your game master is watching and can send you a nudge at any time.",
    },
];

export default function HelpScreen() {
    const { room } = useRoom();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.eyebrow}>How to play</Text>
                    <Text style={styles.title}>Help</Text>
                </View>

                <View style={styles.steps}>
                    {STEPS.map((step, index) => (
                        <View key={step.title} style={styles.step}>
                            <View style={styles.stepIcon}>
                                <Ionicons
                                    name={step.icon}
                                    size={22}
                                    color={colors.primary}
                                />
                            </View>
                            <View style={styles.stepBody}>
                                <Text style={styles.stepTitle}>
                                    {index + 1}. {step.title}
                                </Text>
                                <Text style={styles.stepText}>{step.text}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.brief}>
                    <Text style={styles.briefLabel}>Your mission</Text>
                    <Text style={styles.briefTitle}>{room.name}</Text>
                    <Text style={styles.briefText}>{room.summary}</Text>
                </View>

                <View style={styles.staff}>
                    <Text style={styles.staffLabel}>Staff only</Text>
                    <Link href="/" asChild>
                        <Pressable style={styles.staffBtn}>
                            <Ionicons
                                name="swap-horizontal-outline"
                                size={16}
                                color={colors.mutedForeground}
                            />
                            <Text style={styles.staffBtnText}>Change room</Text>
                        </Pressable>
                    </Link>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 24,
        gap: 24,
    },
    header: {
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
    steps: {
        gap: 12,
    },
    step: {
        flexDirection: "row",
        gap: 12,
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.xl,
        padding: 16,
    },
    stepIcon: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.secondary,
        borderRadius: radius.md,
    },
    stepBody: {
        flex: 1,
        gap: 2,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.cardForeground,
    },
    stepText: {
        fontSize: 14,
        color: colors.mutedForeground,
        lineHeight: 20,
    },
    brief: {
        gap: 4,
        backgroundColor: colors.muted,
        borderRadius: radius.xl,
        padding: 16,
    },
    briefLabel: {
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 1,
        textTransform: "uppercase",
        color: colors.mutedForeground,
    },
    briefTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.foreground,
    },
    briefText: {
        fontSize: 14,
        color: colors.mutedForeground,
        lineHeight: 20,
    },
    staff: {
        alignItems: "center",
        gap: 8,
        paddingTop: 8,
    },
    staffLabel: {
        fontSize: 11,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: colors.mutedForeground,
    },
    staffBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.md,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    staffBtnText: {
        fontSize: 13,
        color: colors.mutedForeground,
    },
});
