import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";

export default function EditProfileScreen() {
  const [name, setName] = useState("");

  return (
    <ImageBackground source={require("../../assets/images/newjournal.jpeg")} style={styles.bg}>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your name" 
          value={name} 
          onChangeText={setName} 
        />
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.btnText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { padding: 30, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4C1D95', marginBottom: 20 },
  input: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 20 },
  saveBtn: { backgroundColor: '#A78BFA', padding: 15, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' }
});