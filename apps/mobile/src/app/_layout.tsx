import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@global-client-auth";
import KeyboardLayout from "@/components/KeyboardLayout";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <StatusBar style="auto" />
            <AuthProvider clientType="mobile">
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
                <Stack.Screen name="(tabs)" />
            </Stack.Protected>
        </Stack>
    );
}
