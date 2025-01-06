import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUserContext } from "../../UserContext";

export default function DayPage() {
  const { user } = useUserContext();
  const { day } = useLocalSearchParams();
  const router = useRouter();

  const [userProgram, setUserProgram] = useState([]);
  const [actualReps, setActualReps] = useState({});
  const [errors, setErrors] = useState({});
  const [programDataId, setProgramDataId] = useState([]);
  const [programDayLength, setProgramDayLength] = useState(0);
  const [programWeekLength, setProgramWeekLength] = useState(0);

  const parseDayAndWeek = (dayString) => {
    const [day, week] = dayString.split("-").map(Number);
    return [day, week];
  };

  const [currentDay, currentWeek] = parseDayAndWeek(day);

  const fetchUserProgram = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/workouts/uncompleted/${user._id}`
      );
      const currentUncompletedProgram = response.data[0];

      setProgramDataId(currentUncompletedProgram["_id"]);
      const filteredProgram = filterProgramData(
        currentUncompletedProgram,
        currentDay,
        currentWeek
      );
      setUserProgram(filteredProgram);

      const programWeekLength =
        currentUncompletedProgram.weeks[
          currentUncompletedProgram.weeks.length - 1
        ].weekNumber;
      setProgramWeekLength(programWeekLength);

      let weekArray =
        currentUncompletedProgram.weeks[
          currentUncompletedProgram.weeks.length - 1
        ];

      const programDayLength =
        weekArray.days[weekArray.days.length - 1].dayNumber;
      setProgramDayLength(programDayLength);
    } catch (error) {
      console.error("Error fetching user program:", error);
      Alert.alert("Error", "Failed to load the program.");
    }
  };

  useEffect(() => {
    fetchUserProgram();
  }, []);

  const filterProgramData = (data, day, week) => {
    const weekData = data?.weeks.find((w) => w.weekNumber === week);
    if (!weekData) return [];
    const dayData = weekData.days.find((d) => d.dayNumber === day);
    return dayData?.exercises || [];
  };

  const handleRepsChange = (id, value) => {
    const isValid = /^(\d+\s*,\s*)*\d+$/.test(value.trim());
    setActualReps((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: !isValid }));
  };

  const handleClick = async (id, value) => {
    const repsArray = value.split(",").map(Number);
    try {
      await axios.put(
        `http://localhost:3000/workouts/${programDataId}/weeks/${currentWeek}/days/${currentDay}/exercises/${id}`,
        { actualReps: repsArray }
      );
      Alert.alert("Success", "Actual reps updated successfully!");
    } catch (error) {
      console.error("Error updating workout:", error.response);
      Alert.alert("Error", "Failed to update actual reps. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back to Workouts</Text>
      </TouchableOpacity>
      <Text style={styles.title}>
        Day {currentDay} / Week {currentWeek}
      </Text>

      <View style={styles.card}>
        {userProgram.map((exercise, index) => (
          <View key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.details}>
              <Text style={styles.detailItem}>Sets: {exercise.sets}</Text>
              <Text style={styles.detailItem}>
                Weight: {exercise.weight} lbs
              </Text>
              <Text style={styles.detailItem}>Reps: {exercise.targetReps}</Text>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  errors[exercise._id] && styles.inputError,
                ]}
                placeholder="Actual Reps"
                keyboardType="numeric"
                value={actualReps[exercise._id] || ""}
                onChangeText={(value) => handleRepsChange(exercise._id, value)}
              />
              <TouchableOpacity
                style={styles.logButton}
                onPress={() =>
                  handleClick(exercise._id, actualReps[exercise._id])
                }
              >
                <Text style={styles.logButtonText}>Log</Text>
              </TouchableOpacity>
            </View>
            {errors[exercise._id] && (
              <Text style={styles.errorText}>Invalid reps format</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: "#4CAF50",
    fontSize: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 16,
  },
  exerciseCard: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  exerciseName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    color: "#ccc",
    fontSize: 14,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#444",
    color: "#fff",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  logButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 4,
  },
  logButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
