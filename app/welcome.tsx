import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams, router } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/service/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function WelcomeNameScreen() {
  const [uid, setUid] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const getUid = async () => {
      const storedUid = await AsyncStorage.getItem("temp_uid");
      setUid(storedUid);
     
    };
    getUid();
  }, []);

  const handleSaveName = async () => {
   
    if (!name || name.trim() === "") {
        Alert.alert("Oops!", "Please enter your name.");
        return;
    }
    
    if (!uid) {
        Alert.alert("Error", "UID not found!");
        return;
    }

    try {
        await updateDoc(doc(db, "users", uid), {
            fullName: name, 
        });
        
        await AsyncStorage.removeItem("temp_uid");
        router.replace("/auth/login");
    } catch (error) {
        console.error("Firebase Error:", error);
        Alert.alert("Error", "Could not save name.");
    }
  };
  

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Image 
        source={require('../assets/images/pooh rosa.jpeg')} 
        style={styles.character} 
      />
      
      <Text style={styles.title}>Hello, Sweetie!</Text>
      <Text style={styles.subtitle}>What should I call you?</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#E0C0C0"
        value={name} 
        onChangeText={setName} 
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveName}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F7", alignItems: 'center', justifyContent: 'center', padding: 30 },
  character: { width: 200, height: 200, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: "900", color: "#5C4033", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#8B7355", marginBottom: 30 },
  input: { width: '100%', backgroundColor: "#FFF", borderRadius: 20, padding: 18, fontSize: 16, borderWidth: 2, borderColor: "#FFD1DC", marginBottom: 25 },
  button: { backgroundColor: "#FFB6C1", paddingVertical: 15, width: '100%', borderRadius: 30, alignItems: "center", shadowColor: "#FF69B4", shadowOpacity: 0.3, elevation: 5 },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" }
});