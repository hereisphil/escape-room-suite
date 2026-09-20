import * as Haptics from "expo-haptics";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

export default function CameraScreen() {
    const [isActive, setIsActive] = useState(true);
    const [permission, requestPermission] = useCameraPermissions();
    // Native barcode events fire many times per frame. A ref is the only
    // lock that takes effect immediately; setState cannot.
    const isProcessingScan = useRef(false);

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
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                active={isActive}
                style={styles.camera}
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={isActive ? handleScan : undefined}
            />
            <View style={styles.buttonContainer}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    message: {
        textAlign: "center",
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: "absolute",
        bottom: 64,
        flexDirection: "row",
        backgroundColor: "transparent",
        width: "100%",
        paddingHorizontal: 64,
    },
    button: {
        flex: 1,
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
});
