import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // For icons
import axios from "axios";

export default function Settings() {
  const router = useRouter();

  const handleProfile = () => {
    Alert.alert("Profile", "Profile button pressed");
    // Navigate to profile screen if needed
    // router.push('/profile');
  };

  const handleLogout = async () => {
    try {
      interface LoginResponse {
        user: {
          user: {
            email: string;
          };
        };
      }

      const response = await axios.post<LoginResponse>(
        "http://localhost:3000/auth/signout"
      );

      // Assuming the API returns a message or token on successful login
      if (response.status === 200) {
        Alert.alert("Successfully logged out");
        router.push("/(home)");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Alert.alert("Couldn't log out");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Profile Button */}
      <TouchableOpacity style={styles.listItem} onPress={handleProfile}>
        <Ionicons name="person-circle-outline" size={24} color="#3b5998" />
        <Text style={styles.listText}>Profile</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.listItem} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#d9534f" />
        <Text style={[styles.listText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // White background like Facebook
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3b5998", // Facebook blue
    marginBottom: 20,
  },
  listItem: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // Light gray divider
  },
  listText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10, // Space between icon and text
    color: "#000",
  },
  logoutText: {
    color: "#d9534f", // Red for logout text
  },
});
