import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";


export default function RootLayout() {

  useEffect(() => {
  async function requestPermission() {
    await Notifications.requestPermissionsAsync();
  }

  requestPermission();
}, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}