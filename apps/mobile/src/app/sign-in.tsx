import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useAuth } from "@global-client-auth";
import { colors, radius } from "@global-theme";
import * as Clipboard from "expo-clipboard";

export default function SignInScreen() {
    const { login, isConnecting, authError } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState("");
    const [copiedMessage, setCopiedMessage] = useState("");

    const copyUsername = async () => {
        try {
            await Clipboard.setStringAsync("detective");
            setCopiedMessage("Username copied.");
            setTimeout(() => {
                setCopiedMessage("");
            }, 3000);
        } catch (_error) {
            setCopiedMessage("Couldn't copy. Try again.");
            setTimeout(() => {
                setCopiedMessage("");
            }, 3000);
        }
    };

    const copyPassword = async () => {
        try {
            await Clipboard.setStringAsync("password123");
            setCopiedMessage("Password copied.");
            setTimeout(() => {
                setCopiedMessage("");
            }, 3000);
        } catch (_error) {
            setCopiedMessage("Couldn't copy. Try again.");
            setTimeout(() => {
                setCopiedMessage("");
            }, 3000);
        }
    };

    function handleSubmit() {
        if (!username || !password) {
            setFormError("All fields are required");
            return;
        }
        setFormError("");
        login({ username, password });
    }

    // Show our own form error first, otherwise whatever the server said.
    const errorMessage = formError || authError;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Mobile Login</Text>

            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

            {copiedMessage && (
                <Text style={styles.copied}>{copiedMessage}</Text>
            )}

            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setUsername}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />

            <Pressable
                style={styles.button}
                onPress={handleSubmit}
                disabled={isConnecting}
            >
                <Text style={styles.buttonText}>
                    {isConnecting ? "Logging in..." : "Submit"}
                </Text>
            </Pressable>

            <View style={styles.copyBox}>
                <Pressable onPress={copyUsername}>
                    <Text style={styles.hint}>Copy username: detective</Text>
                </Pressable>
                <Pressable onPress={copyPassword}>
                    <Text style={styles.hint}>Copy password: password123</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 24,
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.foreground,
        marginBottom: 12,
    },
    error: {
        backgroundColor: colors.muted,
        color: colors.destructive,
        padding: 4,
        borderColor: colors.destructive,
        borderRadius: radius.sm,
        borderWidth: 1,
        marginBottom: 8,
    },
    copied: {
        backgroundColor: colors.muted,
        color: colors.primary,
        padding: 4,
        borderColor: colors.accentForeground,
        borderRadius: radius.sm,
        borderWidth: 1,
        marginBottom: 8,
    },
    input: {
        width: "100%",
        maxWidth: 360,
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderColor: colors.input,
        borderRadius: radius.md,
        color: colors.foreground,
        padding: 10,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: radius.md,
    },
    buttonText: {
        color: colors.primaryForeground,
    },
    copyBox: {
        backgroundColor: colors.muted,
        padding: 6,
        borderRadius: radius.md,
        marginTop: 16,
    },
    hint: {
        padding: 8,
        color: colors.mutedForeground,
        fontWeight: "600",
    },
});
