import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  SafeAreaView, 
  Linking, 
  LayoutAnimation, 
  Platform, 
  UIManager,
  ScrollView 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

if (Platform.OS === 'android' && UIManager && (UIManager as any).setLayoutAnimationEnabledExperimental) {
  (UIManager as any).setLayoutAnimationEnabledExperimental(true);
}

const faqData = [
  { q: "How do I change my PIN?", a: "Go to Profile Settings > Change PIN to update your security code." },
  { q: "Is my data secure?", a: "Yes, your journals are encrypted and only accessible with your personal PIN." },
  { q: "Can I delete my journal?", a: "Yes, open the journal history and swipe left on the entry to delete it." },
];

export default function HelpSupportScreen() {
  const router = useRouter();

  const handleContact = () => {
    Linking.openURL('mailto:support@minitoons.com');
  };

  return (
    <ImageBackground source={require("../../assets/images/newjournal.jpeg")} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#4C1D95" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Help & Support</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.content}>
            <View style={styles.iconCircle}>
              <Ionicons name="chatbubble-ellipses-outline" size={40} color="#A78BFA" />
            </View>
            <Text style={styles.title}>How can we help you?</Text>
            <Text style={styles.description}>
              If you have any questions, feedback, or need help with your account, 
              please feel free to reach out to our support team. We're here for you! ✨
            </Text>

            <TouchableOpacity style={styles.contactBtn} onPress={handleContact}>
              <Ionicons name="mail-outline" size={20} color="#FFF" />
              <Text style={styles.btnText}>Contact Support</Text>
            </TouchableOpacity>

            <View style={styles.faqSection}>
              <Text style={styles.faqTitle}>Common Questions</Text>
              {faqData.map((item, index) => (
                <FAQItem key={index} question={item.q} answer={item.a} />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
   
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={toggleExpand} 
        style={styles.faqHeader}
      >
        <Text style={styles.faqText}>{question}</Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={16} 
          color="#A78BFA" 
        />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  container: { marginTop: 50, flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#4C1D95' },
  content: { alignItems: 'center', paddingBottom: 50 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#4C1D95', marginBottom: 10 },
  description: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 30, paddingHorizontal: 10 },
  contactBtn: { flexDirection: 'row', backgroundColor: '#A78BFA', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 25, alignItems: 'center', gap: 10 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  faqSection: { width: '100%', marginTop: 40 },
  faqTitle: { fontSize: 18, fontWeight: 'bold', color: '#4C1D95', marginBottom: 15 },
  faqItem: { backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 15, marginBottom: 10, overflow: 'hidden' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  faqText: { color: '#5C4077', fontSize: 15, fontWeight: '600' },
  answerContainer: { paddingHorizontal: 18, paddingBottom: 18 },
  answerText: { color: '#6B7280', fontSize: 14, lineHeight: 20 }
});