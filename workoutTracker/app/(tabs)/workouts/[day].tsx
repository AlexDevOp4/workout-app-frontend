import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUserContext } from "../../UserContext";

export default function DayPage() {
  const parseDayAndWeek = (dayString: string): [number, number] => {
    const [day, week] = dayString.split(" ")[1].split("-").map(Number);
    return [day, week];
  };

  const { user } = useUserContext();
  const { day } = useLocalSearchParams();
  const router = useRouter();

  const [userProgram, setUserProgram] = useState<any[]>([]);
  const [actualReps, setActualReps] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [currentDay, currentWeek] = parseDayAndWeek(day as string);

  useEffect(() => {
    fetchUserProgram(currentDay, currentWeek);
  }, [currentDay, currentWeek]);

  const fetchUserProgram = async (day: number, week: number) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/workoutlogs/${user?._id}`
      );
      const filteredProgram = filterProgramData(response.data as any[], day, week);
      console.log(filteredProgram)
      setUserProgram(filteredProgram);
    } catch (error) {
      console.error("Error fetching user program:", error);
      Alert.alert("Error", "Failed to load the program.");
    }
  };

  const filterProgramData = (data: any[], day: number, week: number) => {
    return data
      .flatMap((program) =>
        program.weeks
          .filter((w: any) => w.weekNumber === week)
          .flatMap((w: any) => w.days.filter((d: any) => d.dayNumber === day))
      )
      .flatMap((day: any) => day.exercises);
  };

  const handleRepsChange = (id: string, value: string) => {
    console.log(id, value)
    const isValid = /^(\d+\s*,\s*)*\d+$/.test(value.trim());
    setActualReps((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: !isValid }));
  };

  const handleSubmit = () => {
    console.log(actualReps)
    if (Object.values(errors).some((error) => error)) {
      Alert.alert("Error", "Please fix the errors before submitting.");
      return;
    }
    Alert.alert("Success", "Data submitted successfully!");
  };

  const renderExerciseRow = ({ item }: { item: any }) => (
    <View style={styles.tableRow}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.sets}</Text>
      <Text style={styles.cell}>{item.weight}</Text>
      <Text style={styles.cell}>{item.targetReps}</Text>
      <Text style={styles.cell}>{item.rest}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.cell, styles.input, errors[item._id] && styles.error]}
          value={actualReps[item._id] || ""}
          placeholder="e.g., 10,10,10,10"
          onChangeText={(value) => handleRepsChange(item._id, value)}
        />
        {errors[item.id] && (
          <Text style={styles.errorText}>Invalid format</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back to Workouts</Text>
      </TouchableOpacity>
      <Text style={styles.title}>
        W{currentWeek}/D{currentDay}: Exercises
      </Text>
      <View style={styles.tableRow}>
        <Text style={[styles.cell, styles.header]}>Exercise</Text>
        <Text style={[styles.cell, styles.header]}>Sets</Text>
        <Text style={[styles.cell, styles.header]}>Weight</Text>
        <Text style={[styles.cell, styles.header]}>Reps</Text>
        <Text style={[styles.cell, styles.header]}>Rest</Text>
        <Text style={[styles.cell, styles.header]}>Actual Reps</Text>
      </View>
      <FlatList
        data={userProgram}
        keyExtractor={(item) => item._id}
        renderItem={renderExerciseRow}
      />
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.submitButton}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: "#3b5998",
    fontSize: 16,
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
  error: {
    borderColor: "red",
  },
  inputContainer: {
    flex: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    textAlign: "center",
  },
  submitButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#3b5998",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});
