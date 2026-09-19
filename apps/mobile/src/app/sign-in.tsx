import * as Clipboard from "expo-clipboard";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    Alert,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useAuth } from "@/auth-context";

export default function SignInScreen() {
    const { login, authError } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const copyUsername = async () => {
        await Clipboard.setStringAsync("detective");
        Alert.alert("Username copied to clipboard.");
    };
    const copyPassword = async () => {
        await Clipboard.setStringAsync("password123");
        Alert.alert("Password copied to clipboard.");
    };

    const handleLogin = () => {
        if (!username || !password) {
            const message = "All fields are required";
            setError(message);
            Alert.alert(message);
            return;
        }
        setError("");
        login({ username, password });
    };

    const displayError = error || authError;

    return (
        <SafeAreaView style={styles.container}>
            {displayError && <Text style={styles.error}>{displayError}</Text>}
            <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Username"
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                placeholder="Password"
            />
            <Pressable onPress={handleLogin} style={styles.button}>
                <Text style={{ color: "white", fontWeight: "600" }}>
                    Submit
                </Text>
            </Pressable>
            <View style={styles.credentials}>
                <Pressable onPress={copyUsername}>
                    <Text>Username: detective</Text>
                </Pressable>
                <Pressable onPress={copyPassword}>
                    <Text>Password: password123</Text>
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
    error: {
        backgroundColor: "#ccc",
        color: "red",
        padding: 4,
        borderColor: "red",
        borderRadius: 4,
        borderWidth: 2,
    },
    input: {
        minWidth: 150,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        padding: 12,
        backgroundColor: "skyblue",
        borderRadius: 8,
    },
    credentials: {
        marginTop: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        backgroundColor: "#fefce8",
        alignItems: "flex-start",
        justifyContent: "center",
        borderColor: "#fff085",
        borderWidth: 2,
        borderRadius: 8,
        padding: 12,
    },
});
