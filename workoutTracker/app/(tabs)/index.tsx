import React, { useState, useEffect } from "react";
import axios, { get } from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
export default function ClientDashboardScreen() {
  const { firebaseUID } = useLocalSearchParams();
  const [user, setUser] = useState<any>([]);

  useEffect(() => {
    // Side effect logic here, such as fetching data
    getUser();

    // Optional cleanup function
    return () => {
      console.log("Cleanup logic, if needed.");
    };
  }, []); // Dependency array

  const getUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/firebase?firebaseUID=${firebaseUID}`
      );

      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      Alert.alert("Error", "Error fetching user.");
    }
  };

  // getUser();

  console.log(user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Client Dashboard {user.first_name}</Text>
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
