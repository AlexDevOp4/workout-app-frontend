import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // For icons
import { useUserContext } from "../UserContext";

export default function Settings() {
  const router = useRouter();
  const { userId } = useUserContext();

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/signout");

      if (response.status === 200) {
        Alert.alert("Successfully logged out");
        router.push("/(home)");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Couldn't log out");
    }
  };

  const navigateTo = (path, alertTitle) => {
    Alert.alert(alertTitle, `Navigating to ${alertTitle}`);
    router.push(path);
  };

  return (
    <View className="flex-1 bg-gray-900 p-5">
      <Text className="text-3xl font-bold text-green-400 text-center mb-8">
        Settings
      </Text>

      {/* Profile */}
      <TouchableOpacity
        className="flex-row items-center bg-gray-800 p-4 rounded-lg mb-4 shadow-lg"
        onPress={handleProfile}
      >
        <Ionicons name="person-circle-outline" size={24} color="#34D399" />
        <Text className="ml-4 text-lg text-gray-200 font-medium">Profile</Text>
      </TouchableOpacity>

      {/* My Clients */}
      <TouchableOpacity
        className="flex-row items-center bg-gray-800 p-4 rounded-lg mb-4 shadow-lg"
        onPress={() => navigateTo("/clients", "Clients")}
      >
        <Ionicons name="people-outline" size={24} color="#60A5FA" />
        <Text className="ml-4 text-lg text-gray-200 font-medium">
          My Clients
        </Text>
      </TouchableOpacity>

      {/* Workout Plans */}
      <TouchableOpacity
        className="flex-row items-center bg-gray-800 p-4 rounded-lg mb-4 shadow-lg"
        onPress={() => navigateTo("/workouts", "Workout Plans")}
      >
        <Ionicons name="fitness-outline" size={24} color="#F59E0B" />
        <Text className="ml-4 text-lg text-gray-200 font-medium">
          Workout Plans
        </Text>
      </TouchableOpacity>

      {/* Nutrition Plans */}
      <TouchableOpacity
        className="flex-row items-center bg-gray-800 p-4 rounded-lg mb-4 shadow-lg"
        onPress={() => navigateTo("/nutrition", "Nutrition Plans")}
      >
        <Ionicons name="restaurant-outline" size={24} color="#F87171" />
        <Text className="ml-4 text-lg text-gray-200 font-medium">
          Nutrition Plans
        </Text>
      </TouchableOpacity>

      {/* Progress Tracking */}
      <TouchableOpacity
        className="flex-row items-center bg-gray-800 p-4 rounded-lg mb-4 shadow-lg"
        onPress={() => navigateTo("/progress", "Progress Tracking")}
      >
        <Ionicons name="stats-chart-outline" size={24} color="#A78BFA" />
        <Text className="ml-4 text-lg text-gray-200 font-medium">
          Progress Tracking
        </Text>
      </TouchableOpacity>

      {/* Account Settings */}
      <TouchableOpacity
        className="flex-row items-center bg-gray-800 p-4 rounded-lg mb-4 shadow-lg"
        onPress={() => navigateTo("/settings/account", "Account Settings")}
      >
        <Ionicons name="settings-outline" size={24} color="#FBBF24" />
        <Text className="ml-4 text-lg text-gray-200 font-medium">
          Account Settings
        </Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        className="flex-row items-center bg-red-600 p-4 rounded-lg shadow-lg"
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
        <Text className="ml-4 text-lg text-white font-medium">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
