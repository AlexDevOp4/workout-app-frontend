import React from "react";
import { Tabs } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: "#6366F1", // Indigo-500
        tabBarInactiveTintColor: "#9CA3AF", // Slate-400
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      }}
    >
      {/* Dashboard Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="home" color={color} />
          ),
        }}
      />

      {/* Workouts Tab */}
      <Tabs.Screen
        name="workouts"
        options={{
          title: "Workouts",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="dumbbell" color={color} />
          ),
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#1E293B", // Slate-800
    borderTopWidth: 0, // Remove top border for a clean look
    height: 60, // Slightly taller for easier tapping
  },
  tabBarLabel: {
    fontSize: 12, // Text size
    fontWeight: "500", // Medium weight
  },
  header: {
    backgroundColor: "#0F172A", // Slate-900
    shadowColor: "transparent", // Remove shadow
  },
  headerTitle: {
    color: "#F8FAFC", // Slate-50
    fontWeight: "bold",
    fontSize: 18,
  },
});
