import { Alert, Platform } from "react-native";

const title = "From your game master";

export function showGameMasterMessage(message: string) {
    if (Platform.OS === "web") {
        window.alert(`${title}\n\n${message}`);
        return;
    }

    Alert.alert(title, message);
}
