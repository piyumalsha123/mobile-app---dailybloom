import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SetPinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState("");

  const getUniqueKey = async () => {
  const userId = await AsyncStorage.getItem("loggedInUserId");
  return `userPin_${userId}`; 
};

 const handleFinish = async () => {
  if (pin.length !== 4) {
    Alert.alert("Oops!", "Please enter a 4-digit PIN.");
    return;
  }

  try {

    const userId = await AsyncStorage.getItem("loggedInUserId");
    
    if (userId) {
     
      const uniqueKey = `userPin_${userId}`;
      
      await AsyncStorage.setItem(uniqueKey, pin);
      
      Alert.alert("Success", "Journal secured! ✨");
      router.replace("/tabs/journal");
    }
  } catch (error) {
    Alert.alert("Error", "Something went wrong. Please try again.");
  }
};

  return (
    <ImageBackground 
      source={require('../../assets/images/setpin.jpeg')} 
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        
        <Text style={styles.title}>Secure Your Space</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="****"
            placeholderTextColor="#C6A893"
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            value={pin}
            onChangeText={setPin}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleFinish}>
          <Text style={styles.buttonText}>Save PIN</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 30 
  },
  title: { 
    fontSize: 26, 
    fontWeight: "800", 
    color: "#5C4033", 
    marginBottom: 100, 
    textAlign: 'center'
  },
  input: { 
    width: 200, 
    backgroundColor: "rgba(255, 255, 255, 0.8)", 
    borderRadius: 25, 
    padding: 20, 
    fontSize: 40, 
    textAlign: 'center', 
    borderWidth: 2, 
    borderColor: "#FFB300", 
    color: "#5C4033",
    letterSpacing: 10
  },
  inputWrapper: { 
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: { 
    marginTop: 40,
    backgroundColor: "#FFB7C5", 
    paddingVertical: 15, 
    paddingHorizontal: 50, 
    borderRadius: 30, 
    elevation: 3 
  },
  buttonText: { 
    color: "#FFF", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
});