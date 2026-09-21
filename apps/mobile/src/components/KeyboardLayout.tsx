import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from "react-native";
import type { ReactNode } from "react";

// Wraps the whole app so every screen gets the same keyboard behavior:
// 1. the screen slides up so the keyboard doesn't cover the inputs
// 2. content can scroll when landscape + keyboard leave too little height
// 3. dragging the scroll view dismisses the keyboard
export default function KeyboardLayout({ children }: { children: ReactNode }) {
    return (
        <KeyboardAvoidingView
            style={styles.fill}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                style={styles.fill}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                bounces={false}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
});
