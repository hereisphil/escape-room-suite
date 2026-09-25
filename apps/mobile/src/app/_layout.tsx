import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { AuthProvider, useAuth } from "@global-client-auth";
import { SERVER_PORT, SERVER_URL } from "@global-types";
import { KeyboardLayout } from "@global-client-ui";

function mobileServerUrl(): string {
    const host = Constants.expoConfig?.hostUri?.split(":")[0];
    return host ? `http://${host}:${SERVER_PORT}` : SERVER_URL;
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <StatusBar style="auto" />
            <AuthProvider clientType="mobile" serverUrl={mobileServerUrl()}>
                <KeyboardLayout>
                    <RootNavigator />
                </KeyboardLayout>
            </AuthProvider>
        </SafeAreaProvider>
    );
}

// This has to be its own component so it can read the context
// that <AuthProvider> creates above it.
function RootNavigator() {
    const { isLoggedIn } = useAuth();

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!isLoggedIn}>
                <Stack.Screen name="sign-in" />
            </Stack.Protected>
            <Stack.Protected guard={isLoggedIn}>
                <Stack.Screen name="index" />
                <Stack.Screen name="[roomId]" />
            </Stack.Protected>
        </Stack>
    );
}
