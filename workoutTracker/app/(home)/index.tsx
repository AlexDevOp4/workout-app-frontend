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
import { LogBox } from "react-native";
LogBox.ignoreAllLogs(false);

export default function HomeScreen() {
  const router = useRouter();
  const { setUser } = useUserContext();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const handleLogin = async () => {
    setLoading(true); // Start loading
    setError(null); // Clear previous errors
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_DATABASE_URL}/auth/signin`,
        {
          email,
          password,
        }
      );

      const firebaseUID = response.data as { user: { firebaseUid: string } };
      console.log(firebaseUID.user.firebaseUid);

      const userResponse = await axios.get(
        `${process.env.EXPO_PUBLIC_DATABASE_URL}/users/firebase?firebaseUID=${firebaseUID.user.firebaseUid}`
      );

      const userData = userResponse.data;

      setUser(userData);
      router.push({
        pathname: "/(tabs)",
        params: { firebaseUID: firebaseUID.user.firebaseUid },
      });
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid email or password"); // Show error
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      {error && <Text style={styles.errorMessage}>{error}</Text>}

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
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
        {loading && <View style={styles.spinner}></View>}
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
  spinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "white",
    borderTopColor: "gray",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});
