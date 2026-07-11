import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, ImageBackground, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebase";

export default function NotificationsScreen() {
  const router = useRouter();
  
  const [isEnabled, setIsEnabled] = useState({
    habitReminder: true,
    journalReminder: false,
    dailyTips: true,
  });

  useEffect(() => {
  const loadSettings = async () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (userId) {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists() && userDoc.data().notificationSettings) {
        setIsEnabled(userDoc.data().notificationSettings);
      }
    }
  };
  loadSettings();
}, []);

const toggleSwitch = async (key: keyof typeof isEnabled) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const newValue = !isEnabled[key];
  setIsEnabled(prev => ({ ...prev, [key]: newValue }));

  await setDoc(doc(db, "users", userId), {
    notificationSettings: {
      ...isEnabled,
      [key]: newValue
    }
  }, { merge: true }); 
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