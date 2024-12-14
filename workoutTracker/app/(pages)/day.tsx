import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, FlatList } from "react-native";

export default function DayPage({ route }: { route: any }) {
  const { day } = route.params; // Get the day parameter from the route

  // Example exercises data
  const exercises = [
    {
      id: "1",
      exercise: "Squat",
      sets: 4,
      weight: "100 lbs",
      reps: "10",
      rest: "60s",
    },
    {
      id: "2",
      exercise: "Bench Press",
      sets: 3,
      weight: "150 lbs",
      reps: "8",
      rest: "90s",
    },
    {
      id: "3",
      exercise: "Deadlift",
      sets: 5,
      weight: "200 lbs",
      reps: "5",
      rest: "120s",
    },
  ];

  // State for tracking actual reps
  const [actualReps, setActualReps] = useState<{ [key: string]: string }>({});

  const handleRepsChange = (id: string, value: string) => {
    setActualReps((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{day} - Exercises</Text>

      {/* Table Header */}
      <View style={styles.tableRow}>
        <Text style={[styles.cell, styles.header]}>Exercise</Text>
        <Text style={[styles.cell, styles.header]}>Sets</Text>
        <Text style={[styles.cell, styles.header]}>Weight</Text>
        <Text style={[styles.cell, styles.header]}>Reps</Text>
        <Text style={[styles.cell, styles.header]}>Rest</Text>
        <Text style={[styles.cell, styles.header]}>Actual Reps</Text>
      </View>

      {/* Table Rows */}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.cell}>{item.exercise}</Text>
            <Text style={styles.cell}>{item.sets}</Text>
            <Text style={styles.cell}>{item.weight}</Text>
            <Text style={styles.cell}>{item.reps}</Text>
            <Text style={styles.cell}>{item.rest}</Text>
            <TextInput
              style={[styles.cell, styles.input]}
              value={actualReps[item.id] || ""}
              keyboardType="numeric"
              onChangeText={(value) => handleRepsChange(item.id, value)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  header: {
    fontWeight: "bold",
    backgroundColor: "#ddd",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
});
