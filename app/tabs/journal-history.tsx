import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Modal, TouchableOpacity, TextInput, ImageBackground } from "react-native";
import { collection, query, where, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/service/firebase"; 
import { Ionicons } from "@expo/vector-icons";

export default function JournalHistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [editedText, setEditedText] = useState("");

  const deleteJournal = (id: string) => {
    Alert.alert("Delete Journal", "Are you sure you want to delete this journal?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          try {
            await deleteDoc(doc(db, "journals", id));
            setHistory(history.filter((item) => item.id !== id));
            Alert.alert("Deleted !");
          } catch (error) { Alert.alert("Error deleting journal"); }
        }
      },
    ]);
  };

  const editJournal = (item: any) => {
    setSelectedId(item.id);
    setEditedText(item.content);
    setModalVisible(true);
  };

  const saveEditedJournal = async () => {
    try {
      await updateDoc(doc(db, "journals", selectedId), { content: editedText });
      setHistory(history.map((item) => item.id === selectedId ? { ...item, content: editedText } : item));
      setModalVisible(false);
      Alert.alert("Updated Successfully 🌸");
    } catch (error) { Alert.alert("Update Failed"); }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const q = query(collection(db, "journals"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setHistory(data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchHistory();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FFB6C1" /></View>;

  return (
   <ImageBackground 
    source={require("../../assets/images/history.jpeg")} // ඔයාගේ පින්තූරේ තියෙන පත (path) එක මෙතනට දෙන්න
    style={styles.container}
  >
      <Text style={styles.title}>✨ My Journey ✨</Text>
      
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No journals written yet! ✨</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.date}>{item.date}</Text>
              <View style={styles.icons}>
                <TouchableOpacity onPress={() => editJournal(item)}><Ionicons name="create-outline" size={22} color="#F5A623" /></TouchableOpacity>
                <TouchableOpacity onPress={() => deleteJournal(item.id)}><Ionicons name="trash-outline" size={22} color="#FF7A7A" /></TouchableOpacity>
              </View>
            </View>
            <Text style={styles.content}>{item.content}</Text>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Journal 🌸</Text>
            <TextInput multiline value={editedText} onChangeText={setEditedText} style={styles.modalInput} />
            <TouchableOpacity style={styles.saveButton} onPress={saveEditedJournal}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF0E6", padding: 20, paddingTop: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#5C4033", 
    marginBottom: 20, 
    textAlign: 'center',
    backgroundColor: "#FFFFFF", 
    padding: 10,
    borderRadius: 15,
    overflow: 'hidden' 
  },
  card: { backgroundColor: "#FFF", padding: 18, borderRadius: 15, marginBottom: 15 },
  date: { fontWeight: "bold", color: "#FF69B4", marginBottom: 5, fontSize: 12 },
  content: { color: "#5C4033", fontSize: 15 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#9B8C7B' },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  icons: { flexDirection: "row", gap: 15 },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  modalCard: { width: "90%", backgroundColor: "#FFF", borderRadius: 25, padding: 20 },
  modalTitle: { fontSize: 22, fontWeight: "700", color: "#5C4033", marginBottom: 15 },
  modalInput: { backgroundColor: "#FFF8F5", borderRadius: 18, padding: 15, height: 180, textAlignVertical: "top" },
  saveButton: { marginTop: 20, backgroundColor: "#FFE08A", padding: 15, borderRadius: 30, alignItems: "center" },
  saveText: { fontWeight: "700", color: "#6B4F3F" },
});