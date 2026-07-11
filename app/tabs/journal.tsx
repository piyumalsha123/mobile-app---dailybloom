import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ImageBackground } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/service/firebase";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function JournalScreen() {
  const [journal, setJournal] = useState("");
  const router = useRouter();
  const [selectedMoodEmoji, setSelectedMoodEmoji] = useState("😊");
  const [selectedMoodLabel, setSelectedMoodLabel] = useState("Happy");

  useEffect(() => {
    const checkAccess = async () => {
      const userId = await AsyncStorage.getItem("loggedInUserId");
      const hasPin = await AsyncStorage.getItem(`userPin_${userId}`);
    };
    const loadSavedMood = async () => {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      const today = new Date().toISOString().split('T')[0];

      if (userId) {
        const savedMoodIndex = await AsyncStorage.getItem(`userMood_${userId}_${today}`);
        
        if (savedMoodIndex !== null) {
          const moods = [
            { emoji: "😁", label: "Amazing" },
            { emoji: "😊", label: "Happy" },
            { emoji: "😌", label: "Calm" },
            { emoji: "😔", label: "Sad" },
            { emoji: "😴", label: "Tired" },
          ];
          const mood = moods[parseInt(savedMoodIndex)];
          setSelectedMoodEmoji(mood.emoji);
          setSelectedMoodLabel(mood.label);
        }
      }
    };
    loadSavedMood();
  }, []);

  const saveJournal = async () => {
 
    if (journal.trim() === "") {
      Alert.alert("Empty Journal", "Write something before saving.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

  
    if (!user) {
      Alert.alert("Error", "You must be logged in to save journals.");
      return;
    }

    try {
    await addDoc(collection(db, "journals"), {
      userId: user.uid,
      date: new Date().toISOString().split('T')[0],
      content: journal,
      mood: selectedMoodLabel, 
      moodEmoji: selectedMoodEmoji, 
      createdAt: new Date(),
    });
    
      await addDoc(collection(db, "journals"), {
        userId: user.uid,
        date: new Date().toISOString().split('T')[0], 
        content: journal,
        createdAt: new Date(),
      });
      
      Alert.alert("Success", "Journal saved successfully! 🌸");
      setJournal(""); 
    } catch (error) {
      console.error("Firebase Error: ", error);
      Alert.alert("Error", "Could not save. Try again.");
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/new1.jpeg')} 
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
<View style={styles.header}>
  <Text style={styles.date}>
    {new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })}
  </Text>

  <Text style={styles.title}>Today's Journal 🌸</Text>

  <Text style={styles.subtitle}>
    Write your heart out. Every little thought matters.
  </Text>
</View>

<View style={styles.card}>

 <View style={styles.moodChip}>
  <Text style={styles.moodText}>
    {selectedMoodEmoji} Feeling {selectedMoodLabel}
  </Text>
</View>

  <TextInput
    style={styles.input}
    multiline
    placeholder="How are you feeling today?"
    placeholderTextColor="#A8A8A8"
    value={journal}
    onChangeText={setJournal}
    maxLength={500}
  />

  <Text style={styles.counter}>
    {journal.length}/500
  </Text>

</View>

<TouchableOpacity
  style={styles.button}
  activeOpacity={0.8}
  onPress={saveJournal}
>
  <Text style={styles.buttonText}>
     📖 Save My Journal
  </Text>
</TouchableOpacity>
        
<TouchableOpacity
  style={styles.historyButton}
  activeOpacity={0.8}
  onPress={() => router.push("/tabs/journal-history")}
>
  <Ionicons
    name="book-outline"
    size={20}
    color="#5C4033"
  />

  <Text style={styles.historyText}>
    View Journal History
  </Text>

  <Ionicons
    name="chevron-forward"
    size={18}
    color="#5C4033"
    style={{ marginLeft: 6 }}
  />
</TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage:{
    flex:1,
},
container: {
  flex: 1,
  padding: 24,
},
  header:{
    marginTop:40,
    marginBottom:25,
},

date:{
    color:"#8C6B3F",
    fontSize:14,
},

title:{
    marginTop:8,
    fontSize:30,
    fontWeight:"800",
    color:"#5C4033",
},

subtitle:{
    marginTop:6,
    color:"#8C6B3F",
    lineHeight:22,
},

card: {
  backgroundColor: "rgba(255,255,255,0.75)",
  borderRadius: 30,
  padding: 20,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.55)",
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 12,
  shadowOffset: {
    width: 0,
    height: 6,
  },
  elevation: 8,
},
moodChip:{
    alignSelf:"flex-start",
    backgroundColor:"#FFF4D8",
    paddingHorizontal:14,
    paddingVertical:7,
    borderRadius:30,
    marginBottom:18,
},

moodText:{
    color:"#8C6B3F",
    fontWeight:"700",
},
input: {
  height: 260,
  backgroundColor: "rgba(255,255,255,0.25)",
  borderRadius: 20,
  padding: 18,
  textAlignVertical: "top",
  fontSize: 16,
  color: "#4D4D4D",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.45)",
},
counter:{
    alignSelf:"flex-end",
    color:"#B0B0B0",
    marginTop:10,
},
 button: {
  marginTop: 25,
  backgroundColor: "#FFD97D",
  paddingVertical: 16,
  borderRadius: 30,
  alignItems: "center",
  shadowColor: "#FFD97D",
  shadowOpacity: 0.35,
  shadowRadius: 12,
  shadowOffset: {
    width: 0,
    height: 5,
  },
  elevation: 8,
},
buttonText: {
  color: "#6B4F3F",
  fontWeight: "700",
  fontSize: 17,
},
 historyButton: {
  marginTop: 18,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "center",
  paddingHorizontal: 22,
  paddingVertical: 14,
  borderRadius: 30,
  backgroundColor: "rgba(255,255,255,0.85)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.6)",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: {
    width: 0,
    height: 4,
  },
  elevation: 4,
},

historyText: {
  marginHorizontal: 8,
  color: "#5C4033",
  fontSize: 15,
  fontWeight: "700",
}
});