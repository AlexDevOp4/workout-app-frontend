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

// Type definitions for API responses
interface LoginResponse {
  uid: string; // Assuming the response contains `uid` directly
}

interface UserResponse {
  user_id: number; // Assuming the `user_id` is returned from the second API
}

export default function HomeScreen() {
  const router = useRouter();
  const { setUser } = useUserContext();

  // State variables for user input
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Handle user login
  const handleLogin = async () => {
    try {
      // Step 1: Authenticate user and get Firebase UID
      const response = await axios.post<LoginResponse>(
        "http://localhost:3000/auth/signin",
        { email, password }
      );

      const firebaseUID = response.data["uid"];
      console.log("Firebase UID:", firebaseUID);

      // Step 2: Fetch user data using Firebase UID
      const userResponse = await axios.get<UserResponse>(
        `http://localhost:3000/users/firebase?firebaseUID=${firebaseUID}`
      );

      console.log("User Data:", userResponse.data);

      // Step 3: Handle successful login
      if (response.status === 201 && userResponse.status === 201) {
        const userId = userResponse.data.user_id;
        Alert.alert("Success", `Login successful! User ID: ${userId}`);
        console.log("User ID:", userId);

        // Save user ID in context and navigate to the tabs layout
        setUser(userResponse.data);
        // router.push("/(tabs)");
        router.push({pathname: '/(tabs)/', params: {firebaseUID: firebaseUID}});
      }
    } catch (error) {
      // Handle errors
      console.error("Error logging in:", error);
      Alert.alert("Error", "Invalid email or password.");
    }
  };

  // Render the login form
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Sign-up Link */}
      <Text style={styles.linkText}>
        <Link href="/signup">Don't have an account? Sign up</Link>
      </Text>
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#3b5998",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    marginTop: 20,
    color: "#3b5998",
    fontSize: 14,
  },
});
