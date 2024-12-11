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

export default function HomeScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleLogin = async () => {
    try {
      interface LoginResponse {
        user: {
          user: {
            email: string;
          };
        };
      }

      const response = await axios.post<LoginResponse>(
        "http://localhost:3000/auth/signin",
        {
          email,
          password,
        }
      );

      const firebaseUID = response.data["uid"];

      // Assuming the API returns a message or token on successful login
      if (response.status === 200) {
        Alert.alert("Success", "Login successful! " + response.data);
        console.log("Response Data:", response.data["uid"]);
        router.push({ pathname: "/(tabs)", params: { firebaseUID } });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Alert.alert("Error", "Invalid email or password.");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 20 }}>
        <Link href="/signup">Don't have an account? Sign up</Link>
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
});
