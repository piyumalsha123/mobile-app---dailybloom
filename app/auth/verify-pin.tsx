import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, KeyboardAvoidingView, Platform, BackHandler } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function VerifyPinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState("");

  const getUniqueKey = async () => {
  const userId = await AsyncStorage.getItem("loggedInUserId");
  return `userPin_${userId}`;
};

useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
       
        router.replace("/tabs/home");
        return true; 
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const handleVerify = async () => {
  try {
   
    const userId = await AsyncStorage.getItem("loggedInUserId");
    
    if (userId) {
      const uniqueKey = `userPin_${userId}`;
      
      const savedPin = await AsyncStorage.getItem(uniqueKey);

      if (pin === savedPin) {
       router.replace("/tabs/journal");
      } else {
        Alert.alert("Error", "Incorrect PIN! Try again.");
        setPin("");
      }
    }
  } catch (error) {
    Alert.alert("Error", "Could not verify PIN.");
  }
};

  return (
    
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>

<View style={styles.header}>
  <TouchableOpacity onPress={() => router.replace("/tabs/home")}>
    <Ionicons name="arrow-back" size={28} color="#5C4033" />
  </TouchableOpacity>
</View>


      <Text style={styles.title}>Secure Your Journal</Text>

      <View style={styles.beehiveContainer}>
        <Image 
          source={require('../../assets/images/honey.jpeg')} 
          style={styles.beehiveImage}
          resizeMode="contain"
        />
  
        <View style={styles.overlayInput}>
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
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Unlock Journal</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 50,   
    left: 20,   
    zIndex: 10, 
  },
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "900", 
    color: "#5C4033", 
    marginBottom: 30 
  },
  beehiveContainer: { 
    width: 350,  
    height: 350, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 40 
  },
  beehiveImage: { 
    width: '100%', 
    height: '100%' 
  },
  overlayInput: {
    position: 'absolute', 
  },
  input: { 
    width: 140, 
    backgroundColor: "rgba(255, 255, 255, 0.9)", 
    borderRadius: 15, 
    padding: 10, 
    fontSize: 28, 
    textAlign: 'center', 
    borderWidth: 2, 
    borderColor: "#FFB300", 
    color: "#5C4033",
    letterSpacing: 5
  },
  button: { 
    backgroundColor: "#FFD700", 
    paddingVertical: 15, 
    paddingHorizontal: 60, 
    borderRadius: 30, 
    elevation: 5
  },
  buttonText: { 
    color: "#5C4033", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
});