import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/firebase";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

 useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {

    const savedImage = await AsyncStorage.getItem(`userProfileImage_${user.uid}`);
    if (savedImage) setImage(savedImage);

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      setUserProfile(userDoc.data());
    }
  }
};

 const pickImage = async () => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid; 

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && userId) { 
    const uri = result.assets[0].uri;
    setImage(uri);
    await AsyncStorage.setItem(`userProfileImage_${userId}`, uri);
  }
};

  const handleSignOut = async () => {
    await signOut(getAuth());
    router.replace("/auth/login");
  };

  return (
    <ImageBackground source={require("../../assets/images/newjournal.jpeg")} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Profile Settings</Text>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={50} color="#A78BFA" />
            )}
            <View style={styles.editIcon}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{userProfile?.fullName || "User"}</Text>
          <Text style={styles.userEmail}>{getAuth().currentUser?.email}</Text>
        </View>

      
        <ScrollView>
        
  <SettingsItem 
  icon="person-outline" 
  label="Edit Profile" 
  onPress={() => router.push("/profile/edit-profile")} 
/>

<SettingsItem 
  icon="lock-closed-outline" 
  label="Change PIN" 
  onPress={() => router.push("/auth/setup-pin")} 
/>

<SettingsItem 
  icon="notifications-outline" 
  label="Notifications" 
  onPress={() => router.push("/profile/notifications")} 
/>

<SettingsItem 
  icon="help-circle-outline" 
  label="Help & Support" 
  onPress={() => router.push("/profile/help")} 
/>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color="#FFF" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const SettingsItem = ({ icon, label, onPress }: { icon: any, label: string, onPress: () => void }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.itemLeft}>
      <Ionicons name={icon} size={22} color="#5C4077" />
      <Text style={styles.itemText}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#A78BFA" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#4C1D95', marginBottom: 20, textAlign: 'center' },
  profileCard: { alignItems: 'center', backgroundColor: '#FFF', padding: 25, borderRadius: 30, marginBottom: 20, elevation: 5 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center', marginBottom: 15, position: 'relative' },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  editIcon: { position: 'absolute', bottom: 5, right: 0, backgroundColor: '#A78BFA', padding: 6, borderRadius: 15, borderWidth: 2, borderColor: '#FFF' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#4C1D95' },
  userEmail: { fontSize: 14, color: '#9CA3AF', marginBottom: 5 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 18, borderRadius: 15, marginBottom: 12, elevation: 2 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  itemText: { fontSize: 16, color: '#4C1D95', fontWeight: '500' },
  signOutButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20, backgroundColor: '#F87171', padding: 15, borderRadius: 15 },
  signOutText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});