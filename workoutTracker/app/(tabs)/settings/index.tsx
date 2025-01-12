import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // For icons
import axios from "axios";

export default function Settings() {
  const router = useRouter();

  const handleNavigation = (route, message) => {
    router.push(route);
  };

  const openSupportEmail = () => {
    const email = "alex.ashtiany@gmail.com";
    const subject = "Support";
    const body = "Hi Alex, I need support with...";
    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert(
            "No Email Client Found",
            "No email client is available on your device."
          );
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("Error opening email client:", err));
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_DATABASE_URL}/auth/signout`
      );

      if (response.status === 200) {
        Alert.alert("Successfully logged out");
        router.push("/(home)");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Couldn't log out");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings PAGE!</Text>

      {/* Profile */}
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => handleNavigation("settings/profilepage", "Profile")}
      >
        <Ionicons name="person-circle-outline" size={24} color="#4CAF50" />
        <Text style={styles.listText}>Profile</Text>
      </TouchableOpacity>

      {/* Notifications */}
      <TouchableOpacity
        style={styles.listItem}
        onPress={() =>
          handleNavigation("settings/notifications", "Notifications")
        }
      >
        <Ionicons name="notifications-outline" size={24} color="#FF9800" />
        <Text style={styles.listText}>Notifications</Text>
      </TouchableOpacity>

      {/* Progress Tracker */}
      <TouchableOpacity
        style={styles.listItem}
        onPress={() =>
          handleNavigation("settings/progresstracker", "Progress Tracker")
        }
      >
        <MaterialCommunityIcons name="chart-line" size={24} color="#2196F3" />
        <Text style={styles.listText}>Progress Tracker</Text>
      </TouchableOpacity>

      {/* Workout History */}
      <TouchableOpacity
        style={styles.listItem}
        onPress={() =>
          handleNavigation("settings/workout-history", "Workout History")
        }
      >
        <Ionicons name="time-outline" size={24} color="#9C27B0" />
        <Text style={styles.listText}>Workout History</Text>
      </TouchableOpacity>

      {/* Support */}
      <TouchableOpacity style={styles.listItem} onPress={openSupportEmail}>
        <Ionicons name="help-circle-outline" size={24} color="#00BCD4" />
        <Text style={styles.listText}>Support</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.listItem} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#E53935" />
        <Text style={[styles.listText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // Dark Tailwind blue-gray background
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f8fafc", // Bright Tailwind green
    marginBottom: 20,
    textAlign: "center",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#334155", // Subtle divider
    backgroundColor: "#0F172A", // Darker Tailwind blue-gray for item background
    borderRadius: 8, // Rounded corners for sleek design
    marginBottom: 10,
  },
  listText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    color: "#F1F5F9", // Light Tailwind gray for text
  },
  logoutText: {
    color: "#E53935", // Tailwind red for logout text
  },
});
