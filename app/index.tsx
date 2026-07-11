import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Text,
} from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

 useEffect(() => {
  console.log("Splash mounted");

  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 1200,
    useNativeDriver: true,
  }).start();

  const timer = setTimeout(() => {
    console.log("Navigating...");
    router.replace("/auth/login");
  }, 2500);

  return () => clearTimeout(timer);
}, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.text}>Grow Better Every Day</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF0E6",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 180,
    height: 180,
  },

  text: {
    marginTop: 20,
    fontSize: 18,
    color: "#7D7070",
    fontStyle: "italic",
  },
});