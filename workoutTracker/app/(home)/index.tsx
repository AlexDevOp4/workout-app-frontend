import React, { useState } from "react";
import axios from "axios";
import { Link, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useUserContext } from "../UserContext";

export default function HomeScreen() {
  const router = useRouter();
  const { setUser } = useUserContext();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_DATABASE_URL}/auth/signin`,
        {
          email,
          password,
        }
      );

      const firebaseUID = (response.data as { uid: string }).uid;

      const userResponse = await axios.get(
        `${process.env.EXPO_PUBLIC_DATABASE_URL}/users/firebase?firebaseUID=${firebaseUID}`
      );

      if (response.status === 201 && userResponse.status === 201) {
        setUser(userResponse.data);
        router.push({ pathname: "/(tabs)/", params: { firebaseUID } });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Alert.alert("Error", "Invalid email or password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9CA3AF" // Tailwind Slate-400
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9CA3AF" // Tailwind Slate-400
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.linkText}>
        <Link href="/signup" style={styles.link}>
          Don't have an account? Sign up
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0f172a", // Slate-900
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f8fafc", // Slate-50
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#1e293b", // Slate-800
    borderRadius: 8,
    backgroundColor: "#1e293b", // Slate-800
    color: "#f8fafc", // Slate-50
  },
  button: {
    backgroundColor: "#4F46E5", // Indigo-600
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000", // Add subtle shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Shadow for Android
  },
  buttonText: {
    color: "#f8fafc", // Slate-50
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    marginTop: 20,
    fontSize: 14,
    color: "#9CA3AF", // Slate-400
    textAlign: "center",
  },
  link: {
    color: "#4F46E5", // Indigo-600
    fontWeight: "500",
  },
});
