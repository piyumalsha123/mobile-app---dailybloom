import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TabIconProps = {
  focused: boolean;
  activeColor: string;
  inactiveColor: string;
  activeBg: string;
  activeIcon: any;
  inactiveIcon: any;
};

function TabIcon({
  focused,
  activeColor,
  inactiveColor,
  activeBg,
  activeIcon,
  inactiveIcon,
}: TabIconProps) {
  return (
    <View
      style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: focused ? activeBg : "transparent",
      }}
    >
      <Ionicons
        name={focused ? activeIcon : inactiveIcon}
        size={25}
        color={focused ? activeColor : inactiveColor}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 18,
          height: 74,
          borderRadius: 38,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: {
            width: 0,
            height: 5,
          },
        },
      }}
    >
   
      <Tabs.Screen
        name="home"
        options={{
           href: "/tabs/home",
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeBg="#E8F4FF"
              activeColor="#5A9CF8"
              inactiveColor="#B7B7B7"
              activeIcon="home"
              inactiveIcon="home-outline"
            />
          ),
        }}
      />

    
      <Tabs.Screen
  name="journal"
  options={{
    href: "/tabs/journal",
    title: "Journal",
    tabBarIcon: ({ focused }) => (
      <TabIcon
        focused={focused}
        activeBg="#FFF0F7"
        activeColor="#F38CB8"
        inactiveColor="#B7B7B7"
        activeIcon="book"
        inactiveIcon="book-outline"
      />
    ),
  }}
  listeners={{
    tabPress: async (e) => {
      e.preventDefault();

      try {
        const userId = await AsyncStorage.getItem("loggedInUserId");
        if (!userId) {
          router.push("/auth/login"); 
          return;
        }
        
        const savedPin = await AsyncStorage.getItem(`userPin_${userId}`);
        
        if (!savedPin) {
          router.push("/auth/setup-pin"); 
        } else {
       
      router.replace({
  pathname: "/auth/verify-pin",
  params: { redirectTo: "/tabs/journal" }
});
        }
      } catch (error) {
        console.error("Error checking PIN:", error);
      }
    },
  }}
/>
    
      <Tabs.Screen
        name="habits"
        options={{
          href: "/tabs/habits",
          title: "My Day",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeBg="#FFF7DD"
              activeColor="#F0B429"
              inactiveColor="#B7B7B7"
              activeIcon="checkmark-circle"
inactiveIcon="checkmark-circle-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: "/tabs/profile",
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeBg="#F3EBFF"
              activeColor="#9B7CF5"
              inactiveColor="#B7B7B7"
              activeIcon="person-circle"
              inactiveIcon="person-circle-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="journal-history"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
  name="verify-pin"
  options={{
    href: null, 
  }}
/>

    </Tabs>
  );
}