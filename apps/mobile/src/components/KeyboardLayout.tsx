import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import type { ReactNode } from "react";

// Wraps the whole app so every screen gets the same keyboard behavior:
// 1. the screen slides up so the keyboard doesn't cover the inputs
// 2. tapping an empty area closes the keyboard 🎉
// WHY DON'T MORE APPS ALWAYS APPLY THIS! IT'S ONE OF MY BIGGEST GRIPES!!!
export default function KeyboardLayout({ children }: { children: ReactNode }) {
    return (
        <KeyboardAvoidingView
            style={styles.fill}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* TouchableWithoutFeedback only allows ONE child, so everything
                goes inside this single <View>. */}
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <View style={styles.fill}>{children}</View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
    },
});
