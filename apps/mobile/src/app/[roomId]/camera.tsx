import * as Haptics from "expo-haptics";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { colors, radius } from "@global-theme";
import { useRoom } from "../../lib/room-context";

export default function CameraScreen() {
    const { room, isStarted } = useRoom();
    const [isActive, setIsActive] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const isProcessingScan = useRef(false);

    useFocusEffect(
        useCallback(() => {
            setIsFocused(true);
            return () => setIsFocused(false);
        }, []),
    );

    const handleScan = () => {
        if (isProcessingScan.current) {
            return;
        }

        isProcessingScan.current = true;
        setIsActive(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Scan successful.", "Puzzle has been unlocked", [
            {
                text: "Confirm",
                style: "default",
                onPress: () => {
                    isProcessingScan.current = false;
                    setIsActive(true);
                },
            },
        ]);
    };

    if (!permission) {
        // Camera permissions are still loading.
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <Ionicons
                    name="camera-outline"
                    size={48}
                    color={colors.mutedForeground}
                />
                <Text style={styles.message}>
                    We need your permission to show the camera
                </Text>
                <Pressable onPress={requestPermission} style={styles.button}>
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    const canScan = isFocused && isActive;

    return (
        <View style={styles.container}>
            <CameraView
                active={canScan}
                style={styles.camera}
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={canScan ? handleScan : undefined}
            />

            {/* Overlay: room name up top, a viewfinder frame, and a caption. */}
            <SafeAreaView style={styles.overlay} pointerEvents="none">
                <View style={styles.pill}>
                    <Text style={styles.pillText}>{room.slug}</Text>
                </View>

                <View style={styles.frame}>
                    <View style={[styles.corner, styles.cornerTL]} />
                    <View style={[styles.corner, styles.cornerTR]} />
                    <View style={[styles.corner, styles.cornerBL]} />
                    <View style={[styles.corner, styles.cornerBR]} />
                </View>

                <View style={styles.caption}>
                    <Text style={styles.captionTitle}>
                        {isStarted ? "Scan a QR code" : "Camera ready"}
                    </Text>
                    <Text style={styles.captionText}>
                        {isStarted
                            ? "Point the frame at a code to unlock the puzzle."
                            : "You can scan once your game master starts the clock."}
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    );
}

const FRAME_SIZE = 240;
const CORNER_SIZE = 32;
const CORNER_WIDTH = 4;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    center: {
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 24,
        backgroundColor: colors.background,
    },
    message: {
        fontSize: 16,
        textAlign: "center",
        color: colors.foreground,
        paddingBottom: 10,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: radius.md,
    },
    buttonText: {
        color: colors.primaryForeground,
        fontWeight: "600",
    },
    camera: {
        flex: 1,
    },
    overlay: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 24,
    },
    pill: {
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        borderRadius: 999,
        paddingVertical: 6,
        paddingHorizontal: 14,
    },
    pillText: {
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 1,
        textTransform: "uppercase",
        color: colors.primaryForeground,
    },
    frame: {
        width: FRAME_SIZE,
        height: FRAME_SIZE,
    },
    corner: {
        position: "absolute",
        width: CORNER_SIZE,
        height: CORNER_SIZE,
        borderColor: colors.primaryForeground,
    },
    cornerTL: {
        top: 0,
        left: 0,
        borderTopWidth: CORNER_WIDTH,
        borderLeftWidth: CORNER_WIDTH,
        borderTopLeftRadius: radius.lg,
    },
    cornerTR: {
        top: 0,
        right: 0,
        borderTopWidth: CORNER_WIDTH,
        borderRightWidth: CORNER_WIDTH,
        borderTopRightRadius: radius.lg,
    },
    cornerBL: {
        bottom: 0,
        left: 0,
        borderBottomWidth: CORNER_WIDTH,
        borderLeftWidth: CORNER_WIDTH,
        borderBottomLeftRadius: radius.lg,
    },
    cornerBR: {
        bottom: 0,
        right: 0,
        borderBottomWidth: CORNER_WIDTH,
        borderRightWidth: CORNER_WIDTH,
        borderBottomRightRadius: radius.lg,
    },
    caption: {
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        borderRadius: radius.xl,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginHorizontal: 24,
    },
    captionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.primaryForeground,
    },
    captionText: {
        fontSize: 13,
        textAlign: "center",
        color: colors.primaryForeground,
        opacity: 0.85,
    },
});
