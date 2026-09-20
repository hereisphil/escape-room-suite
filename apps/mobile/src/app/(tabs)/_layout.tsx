import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="camera" />
            <Tabs.Screen name="home" />
        </Tabs>
    );
}
