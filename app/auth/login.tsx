import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../service/firebase';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    const user = userCredential.user; 
    
    if (user) {
      await AsyncStorage.setItem("loggedInUserId", user.uid); 
      Alert.alert("Success", "Welcome back!");
      router.replace("/tabs/home"); 
    }

  } catch (error: any) {
    Alert.alert("Error", error.message);
  }
};
return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={styles.container}>
        
        <Image 
          source={require('../../assets/images/piglet.jpeg')} 
          style={styles.hangingPiglet} 
        />

        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back!</Text>
          
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

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text style={styles.footerText}>Don't have an account? <Text style={{fontWeight: 'bold'}}>Register</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,             
    paddingHorizontal: 30,
    backgroundColor: "#FFF",
  },
  hangingPiglet: {
    position: 'absolute', 
    top: 50,             
    width: 370,
    height: 370,
    alignSelf: 'center',
    zIndex: 0,          
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    zIndex: 1,            
    backgroundColor: 'transparent', 
  },
  title: { 
    fontSize: 32, 
    fontWeight: "900", 
    color: "#5C4033", 
    marginBottom: 30,
    textAlign: 'center'
  },
  input: { 
    width: '100%', 
    backgroundColor: "rgba(255, 255, 255, 0.8)", 
    borderRadius: 20, 
    padding: 18, 
    marginBottom: 15, 
    borderWidth: 2, 
    borderColor: "#FF69B4", 
    color: "#5C4033"
  },
  button: { 
    backgroundColor: "#FF69B4", 
    paddingVertical: 15, 
    width: '100%', 
    borderRadius: 30, 
    alignItems: "center", 
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    elevation: 5
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  footerText: { 
    color: "#5C4033", 
    fontSize: 14,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1
  }
});