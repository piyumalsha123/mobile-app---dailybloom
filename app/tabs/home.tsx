import React, { useEffect, useState, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/service/firebase";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState(0);
  const [userName, setUserName] = useState("Sweetie"); 
  const [progress, setProgress] = useState(0);
  const [habitInfo, setHabitInfo] = useState({ completed: 0, total: 0 });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const moods = [
    { emoji: "😁", label: "Amazing", color: "#FFE5B4" },
    { emoji: "😊", label: "Happy", color: "#FFD6E7" },
    { emoji: "😌", label: "Calm", color: "#DDF4E7" },
    { emoji: "😔", label: "Sad", color: "#D9E8FF" },
    { emoji: "😴", label: "Tired", color: "#EFE4FF" },
  ];

  
  const handleMoodSelect = async (index: number) => {
  setSelectedMood(index);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  
  if (userId) {
 
    const today = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem(`userMood_${userId}_${today}`, index.toString());
  }
};

  useFocusEffect(
  useCallback(() => {
    const loadProfileImage = async () => {
      const auth = getAuth();
      const userId = auth.currentUser?.uid; 

      if (userId) {
      
        const savedImage = await AsyncStorage.getItem(`userProfileImage_${userId}`);
        setProfileImage(savedImage);
      }
    };
    loadProfileImage();
  }, [])
);
  useEffect(() => {
    const loadSavedMood = async () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (userId) {
      const today = new Date().toISOString().split('T')[0];
      const savedMood = await AsyncStorage.getItem(`userMood_${userId}_${today}`);
      if (savedMood !== null) {
        setSelectedMood(parseInt(savedMood));
      }
    }
  };
  loadSavedMood();

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      getDoc(doc(db, "users", user.uid)).then((userDoc) => {
        if (userDoc.exists() && userDoc.data().fullName) {
          setUserName(userDoc.data().fullName);
        }
      });

      const q = query(collection(db, "habits"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const habits = snapshot.docs.map((d) => d.data());
        const total = habits.length;
        const completed = habits.filter((h) => h.completed).length;
        
        setHabitInfo({ completed, total });
        setProgress(total > 0 ? (completed / total) * 100 : 0);
      });

      return () => unsubscribe();
    }
  }, []);

  const handleJournalPress = async () => {
    try {
      const userId = await AsyncStorage.getItem("loggedInUserId");
      if (!userId) {
        router.push("/auth/login");
        return;
      }
      const savedPin = await AsyncStorage.getItem(`userPin_${userId}`);
      savedPin ? router.push("/auth/verify-pin") : router.push("/auth/setup-pin");
    } catch (error) {
      console.error("Error checking PIN:", error);
    }
  };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "☀️ Good Morning", sub: "Let's make today beautiful ✨" };
    if (hour < 18) return { text: "🌤️ Good Afternoon", sub: "Hope your day is going great! 🌻" };
    return { text: "🌙 Good Evening", sub: "Time to relax and reflect 🌿" };
  };

  const greetingData = getGreeting();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFDF8" }}>
      <ScrollView contentContainerStyle={styles.container}>
      
        <View style={styles.header}>
          <View>
            <Text style={styles.goodMorning}>{greetingData.text}</Text>
            <Text style={styles.greeting}>Hello {userName} !</Text>
            <Text style={styles.subText}>{greetingData.sub}</Text>
          </View>
          
          <TouchableOpacity onPress={() => router.push("/tabs/profile")}>
            <View style={styles.avatar}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={24} color="#5A7D66" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.moodSection}>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <View style={styles.moodContainer}>
            {moods.map((m, index) => (
  <TouchableOpacity
    key={index}
    onPress={() => handleMoodSelect(index)} 
    style={[
      styles.moodBtn,
      {
        backgroundColor: m.color,
        borderWidth: selectedMood === index ? 2 : 0,
        borderColor: "#7EBB91",
      },
    ]}
  >
    <Text style={{ fontSize: 28 }}>{m.emoji}</Text>
  </TouchableOpacity>
))}
          </View>
        </View>

        <LinearGradient colors={["#CFEED8", "#F8FFF8"]} style={styles.progressCard}>
          <Text style={styles.progressTitle}>🌱 Daily Progress</Text>
          <Text style={styles.progressText}>{habitInfo.completed} / {habitInfo.total} Habits Completed</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
        </LinearGradient>

        <View style={styles.card}>
          <View style={styles.textArea}>
            <View style={styles.badge}>
              <Ionicons name="sparkles" size={14} color="#F6A623" />
              <Text style={styles.badgeText}>Today's Journal</Text>
            </View>
            <Text style={styles.cardTitle}>Ready to Bloom? 🌸</Text>
            <Text style={styles.description}>
              Take a little moment for yourself.
              Write your thoughts every day. ✨
            </Text>
            <TouchableOpacity style={styles.journalBtn} onPress={handleJournalPress}>
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.btnText}>Start Writing</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require("../../assets/images/poohwcap.jpeg")}
            style={styles.poohIcon}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 22, paddingBottom: 100, backgroundColor: "#FFF" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25, marginTop: 30, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: "#FFFDF8", borderRadius: 20, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 5 },
  goodMorning: { fontSize: 15, color: "#9B8C7B" },
  greeting: { fontSize: 24, fontWeight: "800", color: "#5C4033" },
  subText: { marginTop: 4, color: "#9B8C7B" },
  avatar: { height: 52, width: 52, borderRadius: 26, backgroundColor: "#F3F9F4", justifyContent: "center", alignItems: "center", overflow: 'hidden' },
  avatarImage: { width: 52, height: 52 },
  progressCard: { padding: 15, borderRadius: 25, marginBottom: 20 },
  progressTitle: { fontSize: 18, fontWeight: "700", color: "#3D5B47" },
  progressText: { marginTop: 10, fontSize: 14, color: "#6B7D6D" },
  progressBar: { height: 10, backgroundColor: "#EAF6ED", borderRadius: 20, marginTop: 16, overflow: "hidden" },
  progressFill: { height: 10, width: "60%", backgroundColor: "#84C89D", borderRadius: 20 },
  progressPercent: { marginTop: 12, fontSize: 15, fontWeight: "700", color: "#5A7D66" },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 15, color: "#5A5A5A" },
  moodSection: { marginBottom: 30 },
  moodContainer: { flexDirection: "row", justifyContent: "space-between" },
  moodBtn: { width: 55, height: 55, borderRadius: 28, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: "#FFF2C7", borderRadius: 30, padding: 15, minHeight: 235, overflow: "hidden", position: "relative", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 5, marginBottom: 25 },
  badge: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF8DD", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, alignSelf: "flex-start", marginBottom: 12 },
  badgeText: { marginLeft: 5, fontSize: 11, fontWeight: "700", color: "#B88900" },
  textArea: { width: "60%" },
  cardTitle: { fontSize: 21, fontWeight: "800", color: "#5C4033", marginBottom: 10 },
  description: { fontSize: 14, lineHeight: 20, color: "#7A675A", marginBottom: 20 },
  journalBtn: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", backgroundColor: "#F8AFC3", paddingHorizontal: 18, paddingVertical: 13, borderRadius: 30 },
  btnText: { color: "#fff", fontSize: 14, fontWeight: "700", marginLeft: 6 },
  poohIcon: { position: "absolute", right: -8, bottom: -8, width: 135, height: 135, borderRadius: 70, resizeMode: "cover" },
});