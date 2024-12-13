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

  // Sign up logic
  // Sign up should sign up user creds to firebase and add them to mongodb users collection at the same time

  const handleSignUp = async () => {
    const BASE_URL = "http://localhost:3000";
    if (!email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // Adds user to firebase
      interface SignUpResponse {
        uid: string;
      }

      const response = await axios.post<SignUpResponse>(
        "http://localhost:3000/auth/signup",
        {
          email,
          password,
        }
      );

      const firebaseUID = response.data[0]?.uid;
      const trainerId = 825800;
      const role = "client";

      const createUserResponse = await axios.post<SignUpResponse>(
        "http://localhost:3000/users",
        {
          first_name: first_name,
          last_name: last_name,
          role: role,
          firebaseUID: firebaseUID,
          trainerId: trainerId,
          email: email,
        }
      );

      // Assuming the API returns a message or token on successful login
      if (response.status === 201 && createUserResponse.status === 201) {
        Alert.alert("Success", "Sign up successful! ");
        router.push({ pathname: "/(tabs)", params: { firebaseUID } });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Alert.alert("Error", "Invalid email or password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up{user?.first_name}</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#aaa"
        value={first_name}
        onChangeText={setFirstName}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#aaa"
        value={last_name}
        onChangeText={setLastName}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#aaa"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 20 }}>
        <Link href="/(home)">Have an account? Log in</Link>
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
    backgroundColor: "#f5f5f5",
    paddingBottom: 80,
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
    borderRadius: 5,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#3b5998",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
