import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../service/firebase'; 
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
const handleRegister = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

   await setDoc(doc(db, "users", user.uid), {
  email: email,
  createdAt: new Date().toISOString(),
});

   await AsyncStorage.setItem("temp_uid", user.uid); 

router.push("/welcome");
  } catch (error: any) {
    Alert.alert("Error", error.message);
  }
};

 return (
  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
    
    <Image 
      source={require('../../assets/images/pinkpig.jpeg')} 
      style={styles.character} 
    />
    <View style={styles.content}>
      <Text style={styles.title}>Create Account</Text>
      
      <TextInput 
        style={styles.input}
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail}
        placeholderTextColor="#E0C0C0"
      />
      <TextInput 
        style={styles.input}
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        placeholderTextColor="#E0C0C0"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text style={styles.footerText}>Already have an account? <Text style={{fontWeight: 'bold'}}>Login</Text></Text>
      </TouchableOpacity>
    </View>

  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAD2" },
  
  content: { 
    flex: 1, 
    justifyContent: 'flex-start', 
    paddingTop: 200,            
    paddingHorizontal: 30
  },
  
  character: { 
    position: 'absolute', 
    bottom: -50,         
    right: -120,        
    width: 550,         
    height: 500, 
    resizeMode: 'contain' 
  },

  title: { fontSize: 28, fontWeight: "900", color: "#5C4033", marginBottom: 30 },
  input: { width: '100%', backgroundColor: "#FFF", borderRadius: 20, padding: 18, marginBottom: 15, borderWidth: 2, borderColor: "#FF69B4" },
  button: { backgroundColor: "#FF69B4", paddingVertical: 15, width: '100%', borderRadius: 30, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  footerText: { color: "#5C4033", fontSize: 14 }
});