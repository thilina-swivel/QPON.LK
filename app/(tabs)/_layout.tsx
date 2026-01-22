import {
  Manrope_500Medium,
  Manrope_600SemiBold,
  useFonts as useManropeFonts,
} from "@expo-google-fonts/manrope";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { Colors, Fonts } from "@/constants/theme";

type TabIconProps = {
  name: keyof typeof Feather.glyphMap;
  color: string;
  focused: boolean;
  isCenter?: boolean;
};

const TabIcon = ({ name, color, focused, isCenter }: TabIconProps) => {
  if (isCenter) {
    return (
      <View style={styles.centerButton}>
        <Feather name={name} size={24} color={Colors.white} />
      </View>
    );
  }

  return (
    <View style={styles.tabIconContainer}>
      <Feather name={name} size={22} color={color} />
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
};

export default function TabLayout() {
  const [manropeLoaded] = useManropeFonts({
    Manrope_500Medium,
    Manrope_600SemiBold,
  });

  if (!manropeLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.orange,
        tabBarInactiveTintColor: Colors.gray500,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="grid" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: "Nearby",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="map-pin"
              color={Colors.white}
              focused={focused}
              isCenter
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="credit-card" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="user" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    height: Platform.OS === "ios" ? 88 : 70,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 20,
  },
  tabBarLabel: {
    fontFamily: Fonts.body.medium,
    fontSize: 11,
    marginTop: 4,
  },
  tabBarItem: {
    paddingTop: 4,
  },
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeIndicator: {
    position: "absolute",
    top: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.orange,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.orange,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
