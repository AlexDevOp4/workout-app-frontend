import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useUserContext } from "../UserContext";

export default function Workouts() {
  const { user } = useUserContext();

  console.log(user, 'user!!!')
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Workouts Screen</Text>
      {user ? (
        <>
          <Text style={styles.text}>Welcome, {user.first_name}!</Text>
          <Text style={styles.text}>Your Role: {user.role}</Text>
        </>
      ) : (
        <Text style={styles.text}>No user data available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
  },
});
