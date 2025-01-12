import { Link, useRouter } from "expo-router";
import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { useUserContext } from "../UserContext";

export default function SignUpScreen() {
  const { user } = useUserContext();
  const router = useRouter();
  const [first_name, setFirstName] = useState<string>("");
  const [last_name, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSignUp = async () => {
    const BASE_URL = process.env.EXPO_PUBLIC_DATABASE_URL;

    if (!email || !password || !confirmPassword || !first_name || !last_name) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, {
        email,
        password,
      });

      const firebaseUID = response.data?.uid;
      const trainerId = 825800;
      const role = "client";

      const createUserResponse = await axios.post(`${BASE_URL}/users`, {
        first_name,
        last_name,
        role,
        firebaseUID,
        trainerId,
        email,
      });

      if (response.status === 201 && createUserResponse.status === 201) {
        Alert.alert("Success", "Sign up successful!");
        router.push({ pathname: "/(tabs)", params: { firebaseUID } });
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      Alert.alert("Error", "Unable to sign up. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#9CA3AF" // Slate-400
        value={first_name}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#9CA3AF" // Slate-400
        value={last_name}
        onChangeText={setLastName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9CA3AF" // Slate-400
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9CA3AF" // Slate-400
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#9CA3AF" // Slate-400
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.linkText}>
        <Link href="/(home)" style={styles.link}>
          Already have an account? Log In
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
    width: "100%",
    padding: 15,
    backgroundColor: "#4F46E5", // Indigo-600
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    shadowColor: "#000",
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
    color: "#9CA3AF", // Slate-400
    fontSize: 14,
    textAlign: "center",
  },
  link: {
    color: "#4F46E5", // Indigo-600
    fontWeight: "500",
  },
});
