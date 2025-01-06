import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import StyledButton from "../components/StylesButton";

export default function ClientDashboardScreen() {
  const router = useRouter();
  const { firebaseUID } = useLocalSearchParams();

  // State variables
  const [user, setUser] = useState(null); // Ensure null default value
  const [usersCurrentProgram, setUsersCurrentProgram] = useState(null); // null ensures no accidental property access
  const [loading, setLoading] = useState(false);
  const [completedPrograms, setCompletedPrograms] = useState([]);
  const [userProgramData, setUserProgramData] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);

  const countCompletedDays = (programs) => {
    let completedDaysCount = 0;

    programs.forEach((program) => {
      program.weeks.forEach((week) => {
        week.days.forEach((day) => {
          const allExercisesCompleted = day.exercises.every(
            (exercise) => exercise.actualReps && exercise.actualReps.length > 0
          );
          if (allExercisesCompleted) {
            completedDaysCount += 1;
          }
        });
      });
    });

    return completedDaysCount;
  };

  // Fetch user data and program
  const getUser = async () => {
    setLoading(true);
    try {
      // Replace with your API base URL or environment variable
      const API_BASE_URL =
        process.env.REACT_NATIVE_APP_API_URL || "http://localhost:3000";

      // Fetch user data
      const userResponse = await axios.get(
        `${API_BASE_URL}/users/firebase?firebaseUID=${firebaseUID}`
      );
      const usersId = userResponse.data._id;

      // Fetch programs in parallel
      const [currentProgramResponse, userPrograms] = await Promise.all([
        axios.get(`${API_BASE_URL}/workouts/uncompleted/${usersId}`),
        axios.get(`${API_BASE_URL}/workouts?clientId=${usersId}`),
      ]);

      console.log(userPrograms.data, "currentProgramResponse");

      console.log(countCompletedDays(userPrograms.data));

      setUserProgramData(userPrograms.data);

      const completedPrograms = userPrograms.data.filter(
        (program) => program.completed === true
      );

      const completedWorkouts = userPrograms.data
        .filter((program) => program.completed) // Only programs where completed === true
        .map((program) => ({
          programName: program.programName,
          date: new Date(program.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }), // Format updatedAt to a readable date// Use updatedAt as the completion date
        }));

      console.log(completedPrograms.length, "completedPrograms");
      setCompletedWorkouts(completedWorkouts);
      setCompletedPrograms(completedPrograms);

      // Set state
      setUser(userResponse.data);
      setUsersCurrentProgram(currentProgramResponse.data);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      Alert.alert("Error", "Failed to load user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    getUser();
  }, []);

  // Handle workout navigation
  const handleStartWorkout = () => {
    router.push("/(tabs)/workouts/");
  };

  // Render loading state
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Render the component
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome back, {user ? user.first_name : "Guest"}
        </Text>
      </View>

      {/* Current Program */}
      {usersCurrentProgram ? (
        <View style={styles.programCard}>
          <Text style={styles.programTitle}>
            {usersCurrentProgram[0].programName || "No Program Available"}
          </Text>
          <Text style={styles.progress}>
            Week {usersCurrentProgram[0].currentWeek || "N/A"} of{" "}
            {usersCurrentProgram[0].weeks?.length || "N/A"} | Day{" "}
            {usersCurrentProgram[0].currentDay || "N/A"}
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleStartWorkout}>
            <Text style={styles.buttonText}>Start Today’s Workout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.programCard}>
          <Text style={styles.programTitle}>No Program Found</Text>
        </View>
      )}

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {completedPrograms.length || "N/A"}{" "}
          </Text>
          <Text style={styles.statLabel}>Programs Completed</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {countCompletedDays(userProgramData) || "N/A"}
          </Text>
          <Text style={styles.statLabel}>Completed Workouts</Text>
        </View>
      </View>

      {/* Workout History */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Workout History</Text>
        {completedWorkouts.length > 0 ? (
          completedWorkouts.map((program, index) => (
            <View key={index} style={styles.historyCard}>
              <Text style={styles.historyDate}>{program.date}</Text>
              <Text style={styles.historySummary}>{program.programName}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noHistoryText}>
            No workout history available.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  noHistoryText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  programCard: {
    backgroundColor: "#2a2a2a",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  programTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  progress: {
    color: "#ccc",
    fontSize: 14,
    marginVertical: 10,
  },
  startWorkoutButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: "#2a2a2a",
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#ccc",
    fontSize: 12,
  },
  historySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyCard: {
    backgroundColor: "#2a2a2a",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyDate: {
    color: "#ccc",
    fontSize: 14,
  },
  historySummary: {
    color: "#fff",
    fontSize: 16,
  },
  banner: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  bannerText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    flexShrink: 0, // Equivalent to "flex-none" in Tailwind
    borderRadius: 8, // Rounded corners; 8px matches "rounded-md"
    backgroundColor: "#6366F1", // Indigo-500
    paddingHorizontal: 14, // px-3.5 (14px padding left and right)
    paddingVertical: 10, // py-2.5 (10px padding top and bottom)
    fontSize: 14, // text-sm
    fontWeight: "600", // font-semibold
    color: "#FFFFFF", // White text
    shadowColor: "#000", // Shadow settings for React Native
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4, // Matches "shadow-sm"
    elevation: 4, // Adds shadow for Android
    textAlign: "center",
    alignItems: "center",
  },
});
