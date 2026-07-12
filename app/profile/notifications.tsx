import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebase";

import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


const HABIT_ID = "habit_notification";
const JOURNAL_ID = "journal_notification";
const TIPS_ID = "tips_notification";

const requestPermission = async () => {
  const settings = await Notifications.getPermissionsAsync();

  if (settings.granted) {
    return true;
  }

  const request = await Notifications.requestPermissionsAsync();

  if (!request.granted) {
    Alert.alert(
      "Notifications Disabled",
      "Please allow notification permission from your device settings."
    );
    return false;
  }

  return true;
};

const scheduleNotification = async (
  storageKey: string,
  title: string,
  body: string,
  hour: number,
  minute: number
) => {
  const granted = await requestPermission();

  if (!granted) return;

  const oldId = await AsyncStorage.getItem(storageKey);

  if (oldId) {
    await Notifications.cancelScheduledNotificationAsync(oldId);
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: " Notification Test",
      body: "Notifications are working correctly!",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
    },
  });

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
   trigger: {
  type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
  hour,
  minute,
  repeats: true,
},
  });

  await AsyncStorage.setItem(storageKey, id);
};

const cancelNotification = async (storageKey: string) => {
  const id = await AsyncStorage.getItem(storageKey);

  if (id) {
    await Notifications.cancelScheduledNotificationAsync(id);
    await AsyncStorage.removeItem(storageKey);
  }
};

export default function NotificationsScreen() {
  const router = useRouter();
  
  const [isEnabled, setIsEnabled] = useState({
    habitReminder: true,
    journalReminder: false,
    dailyTips: true,
  });

  useEffect(() => {
  const initialize = async () => {
   
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#7C3AED",
      });
    }

    await requestPermission();

    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) return;

    const userDoc = await getDoc(doc(db, "users", userId));

    if (
      userDoc.exists() &&
      userDoc.data().notificationSettings
    ) {
      setIsEnabled(userDoc.data().notificationSettings);
    }
  };

  initialize();

}, []);

const toggleSwitch = async (key: keyof typeof isEnabled) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  if (!userId) return;

  const newValue = !isEnabled[key];

  const updatedSettings = {
    ...isEnabled,
    [key]: newValue,
  };

  setIsEnabled(updatedSettings);

  await setDoc(
    doc(db, "users", userId),
    {
      notificationSettings: updatedSettings,
    },
    { merge: true }
  );

  if (key === "habitReminder") {
    if (newValue) {
      await scheduleNotification(
        HABIT_ID,
        "🌸 DailyBloom",
        "Don't forget to complete your habits today!",
        9,
        0
      );
      Alert.alert(
  "Reminder Enabled",
  "Daily reminder has been turned on."
);
    } else {
      await cancelNotification(HABIT_ID);
      Alert.alert(
  "Reminder Disabled",
  "Daily reminder has been turned off."
);
    }
  }

  if (key === "journalReminder") {
    if (newValue) {
      await scheduleNotification(
        JOURNAL_ID,
        "📖 Daily Journal",
        "Take a few minutes to write your journal.",
        8,
        0
      );
       Alert.alert(
  "Reminder Enabled",
  "Daily reminder has been turned on."
);
    } else {
      await cancelNotification(JOURNAL_ID);
      Alert.alert(
  "Reminder Disabled",
  "Daily reminder has been turned off."
);
    }
  }

  if (key === "dailyTips") {
    if (newValue) {
      await scheduleNotification(
        TIPS_ID,
        "✨ Daily Inspiration",
        "Here's your positive quote for today 🌼",
        10,
        0
      );
       Alert.alert(
  "Reminder Enabled",
  "Daily reminder has been turned on."
);
    } else {
      await cancelNotification(TIPS_ID);
      Alert.alert(
  "Reminder Disabled",
  "Daily reminder has been turned off."
);
    }
  }
};
  return (
    <ImageBackground source={require("../../assets/images/newjournal.jpeg")} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
      
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#4C1D95" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <View style={styles.card}>
          <NotificationItem 
            label="Habit Reminders" 
            subLabel="Get notified to complete your daily habits"
            value={isEnabled.habitReminder} 
            onToggle={() => toggleSwitch('habitReminder')} 
          />
          <NotificationItem 
            label="Journaling Reminders" 
            subLabel="Friendly nudges to write your thoughts"
            value={isEnabled.journalReminder} 
            onToggle={() => toggleSwitch('journalReminder')} 
          />
          <NotificationItem 
            label="Daily Inspiration Tips" 
            subLabel="Receive positive quotes and tips"
            value={isEnabled.dailyTips} 
            onToggle={() => toggleSwitch('dailyTips')} 
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const NotificationItem = ({ label, subLabel, value, onToggle }: any) => (
  <View style={styles.item}>
    <View style={styles.textContainer}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.subLabel}>{subLabel}</Text>
    </View>
    <Switch
      trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
      thumbColor={value ? "#7C3AED" : "#f4f3f4"}
      onValueChange={onToggle}
      value={value}
    />
  </View>
);

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  container: {  marginTop: 50,flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#4C1D95' },
  card: { backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 25, padding: 10 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  textContainer: { flex: 1 },
  itemLabel: { fontSize: 16, fontWeight: '600', color: '#4C1D95' },
  subLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
});