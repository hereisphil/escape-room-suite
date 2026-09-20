import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useAuth } from "@global-client-auth";
import * as Clipboard from "expo-clipboard";

export default function SignInScreen() {
    const { login, isConnecting, authError } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState("");

    const copyUsername = async () => {
        try {
            await Clipboard.setStringAsync("detective");
            Alert.alert("Username copied.");
        } catch (_error) {
            Alert.alert("Couldn't copy. Try again.");
        }
    };

    const copyPassword = async () => {
        try {
            await Clipboard.setStringAsync("password123");
            Alert.alert("Password copied.");
        } catch (_error) {
            Alert.alert("Couldn't copy. Try again.");
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

            {errorMessage ? (
                <Text style={styles.error}>{errorMessage}</Text>
            ) : null}

            <TextInput
                style={styles.input}
                placeholder="Username"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setUsername}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
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
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
    },
    error: {
        backgroundColor: "#ccc",
        color: "red",
        padding: 4,
        borderColor: "red",
        borderRadius: 4,
        borderWidth: 2,
    },
    input: {
        minWidth: 200,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        backgroundColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 6,
    },
    buttonText: {
        color: "white",
    },
    copyBox: {
        backgroundColor: "#f9f9f9",
        padding: 6,
        borderRadius: 4,
        marginTop: 16,
    },
    hint: {
        padding: 8,
        color: "#666",
        fontWeight: "600",
    },
});
