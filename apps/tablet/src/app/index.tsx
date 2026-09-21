import { StyleSheet, Text, View } from "react-native";
import { colors } from "@global-theme";

export default function App() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Open up App.tsx to start working on your app!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: colors.foreground,
    },
});
