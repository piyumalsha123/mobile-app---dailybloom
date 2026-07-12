import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

useEffect(() => {
  async function requestPermission() {
    await Notifications.requestPermissionsAsync();
  }

  requestPermission();
}, []);

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}