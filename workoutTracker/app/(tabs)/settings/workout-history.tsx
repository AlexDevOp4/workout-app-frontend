import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useUserContext } from "../../UserContext";
export default function WorkoutHistoryPage() {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUserContext();
  // Fetch the user's workout history
  const fetchWorkoutHistory = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DATABASE_URL}/workouts?clientId=${user?._id}` // Replace USER_ID dynamically
      );
      const data = await response.json();
      setWorkoutHistory(data);
    } catch (error) {
      console.error("Error fetching workout history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Workout History...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Workout History</Text>

      {workoutHistory.length === 0 ? (
        <View style={styles.noWorkoutsContainer}>
          <Text style={styles.noWorkoutsText}>
            No workouts found. Start a new program to see your history here.
          </Text>
        </View>
      ) : (
        workoutHistory.map((program) => (
          <View key={program._id} style={styles.programCard}>
            <Text style={styles.programName}>{program.programName}</Text>
            <Text style={styles.programInfo}>
              Duration: {program.totalWeeks} Weeks
            </Text>
            <Text style={styles.programInfo}>
              Status:{" "}
              <Text
                style={{
                  color: program.completed ? "#4CAF50" : "#FFC107", // Green for completed, yellow for in progress
                  fontWeight: "bold",
                }}
              >
                {program.completed ? "Completed" : "In Progress"}
              </Text>
            </Text>

            {program.weeks.map((week) => (
              <View key={week.weekNumber} style={styles.weekContainer}>
                <Text style={styles.weekTitle}>Week {week.weekNumber}</Text>

                {week.days.map((day) => (
                  <View key={day.dayNumber} style={styles.dayCard}>
                    <Text style={styles.dayTitle}>Day {day.dayNumber}</Text>
                    {day.exercises.map((exercise, index) => (
                      <View key={index} style={styles.exerciseContainer}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        <Text style={styles.exerciseDetails}>
                          {exercise.weight} lbs, {exercise.sets} sets x{" "}
                          {exercise.targetReps} reps
                        </Text>
                        <Text style={styles.exerciseDetails}>
                          Actual Reps:{" "}
                          {exercise.actualReps.length > 0
                            ? exercise.actualReps.join(", ")
                            : "Not recorded"}
                        </Text>
                        <Text style={styles.exerciseDetails}>
                          RPE: {exercise.rpe}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F2937", // Dark background
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F2937", // Dark background
  },
  loadingText: {
    color: "#F9FAFB", // White text
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F9FAFB", // Green accent
    textAlign: "center",
    marginBottom: 20,
  },
  noWorkoutsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noWorkoutsText: {
    color: "#D1D5DB", // Gray text
    fontSize: 16,
    textAlign: "center",
  },
  programCard: {
    backgroundColor: "#374151", // Slightly lighter dark background
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  programName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6366F1", // Green accent
    marginBottom: 10,
  },
  programInfo: {
    fontSize: 14,
    color: "#D1D5DB", // Gray text
    marginBottom: 5,
  },
  weekContainer: {
    marginTop: 10,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6366F1", // Indigo accent
    marginBottom: 10,
  },
  dayCard: {
    backgroundColor: "#1F2937", // Dark background for days
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F9FAFB", // White text
    marginBottom: 8,
  },
  exerciseContainer: {
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F9FAFB", // White text
  },
  exerciseDetails: {
    fontSize: 12,
    color: "#D1D5DB", // Gray text
  },
});
