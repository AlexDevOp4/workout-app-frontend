import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useUserContext } from "../../UserContext";

export default function ProfilePage() {
  const { user } = useUserContext();
  const router = useRouter();

  const handleBackToSettings = () => {
    router.push("/(tabs)/settings");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* Profile Information */}
      <View style={styles.profileCard}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>First Name</Text>
          <Text style={styles.value}>{user?.first_name || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Last Name</Text>
          <Text style={styles.value}>{user?.last_name || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{user?.role || "Client"}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F2937", // Slate-800
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F9FAFB", // Slate-50
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: "#374151", // Slate-700
    borderRadius: 8,
    padding: 20,
    width: "100%",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#D1D5DB", // Slate-300
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#F9FAFB", // Slate-50
    fontWeight: "400",
  },
  backButton: {
    backgroundColor: "#6366F1", // Indigo-500
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF", // White
  },
});
