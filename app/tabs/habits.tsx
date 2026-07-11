import React, { useEffect, useState } from "react";
// 1. ImageBackground import කරගන්න
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, addDoc, query, where, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/service/firebase";

export default function HabitsScreen() {
  const [habits, setHabits] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("☀️ Good Morning");
    else if (hour < 18) setGreeting("🌤 Good Afternoon");
    else setGreeting("🌙 Good Evening");

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "habits"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHabits(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveHabit = async () => {
    const auth = getAuth();
    if (editingId) {
      await updateDoc(doc(db, "habits", editingId), { title: habitName });
    } else {
      await addDoc(collection(db, "habits"), {
        title: habitName,
        category: "General",
        completed: false,
        userId: auth.currentUser?.uid
      });
    }
    setHabitName("");
    setEditingId(null);
    setModalVisible(false);
  };

  const toggleHabit = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "habits", id), { completed: !currentStatus });
  };

  const deleteHabit = async (id: string) => {
    await deleteDoc(doc(db, "habits", id));
  };

  const progress = habits.length > 0 ? (habits.filter(h => h.completed).length / habits.length) * 100 : 0;

  return (
   
    <ImageBackground 
      source={require("../../assets/images/new.jpeg")} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.title}>My Day 🌼</Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressText}>Today's Progress</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={{color: '#5C4033'}}>{habits.filter(h => h.completed).length} / {habits.length} Completed</Text>
        </View>

        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.habitCard}>
              <TouchableOpacity onPress={() => toggleHabit(item.id, item.completed)} style={{flex:1}}>
                <Text style={styles.habitTitle}>{item.completed ? "☑️" : "☐"} {item.title}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 15 }}>
                <TouchableOpacity onPress={() => { setHabitName(item.title); setEditingId(item.id); setModalVisible(true); }}>
                  <Ionicons name="create-outline" size={20} color="#F5A623" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteHabit(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#FF7A7A" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <TouchableOpacity style={styles.fab} onPress={() => { setEditingId(null); setHabitName(""); setModalVisible(true); }}>
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#5C4033" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{editingId ? "Edit Habit" : "Add Habit"}</Text>
              <TextInput style={styles.input} value={habitName} placeholder="Habit Name" onChangeText={setHabitName} />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveHabit}>
                <Text style={{color: '#FFF', fontWeight: 'bold'}}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: { 
    flex: 1, 
    padding: 20, 
    paddingTop: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)' 
  },
  header: { marginBottom: 20 },
  greeting: { fontSize: 16, color: "#5C4033" },
  title: { fontSize: 28, fontWeight: "bold", color: "#5C4033" },
  progressCard: { backgroundColor: "#FFFFFF", padding: 20, borderRadius: 20, marginBottom: 20, elevation: 5 },
  progressBarContainer: { height: 10, backgroundColor: "#EEE", borderRadius: 5, marginVertical: 10 },
  progressBar: { height: 10, backgroundColor: "pink", borderRadius: 5 },
  progressText: { fontSize: 16, fontWeight: "600", color: "#5C4077", marginBottom: 5 },
  habitCard: { backgroundColor: "#FFF", padding: 15, borderRadius: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  habitTitle: { fontSize: 18, color: "#5C4033" },
  fab: { position: 'absolute', bottom: 100, right: 30, backgroundColor: "#FFDDE8", width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: '#FFF', padding: 20, borderRadius: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 5 },
  saveButton: { backgroundColor: "#5C4033", padding: 15, borderRadius: 10, alignItems: 'center' },
  closeButton: { position: 'absolute', top: 10, right: 10, padding: 5 },
});