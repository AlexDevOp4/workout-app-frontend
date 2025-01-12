import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";

export default function ClientDashboardScreen() {
  const router = useRouter();
  const { firebaseUID } = useLocalSearchParams();

  const [user, setUser] = useState(null);
  const [usersCurrentProgram, setUsersCurrentProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedPrograms, setCompletedPrograms] = useState([]);
  const [userProgramData, setUserProgramData] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);

  const countCompletedDays = (programs) => {
    return programs.reduce((total, program) => {
      return (
        total +
        program.weeks.reduce((weekTotal, week) => {
          return (
            weekTotal +
            week.days.filter((day) =>
              day.exercises.every(
                (exercise) =>
                  exercise.actualReps && exercise.actualReps.length > 0
              )
            ).length
          );
        }, 0)
      );
    }, 0);
  };

  const getUser = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = process.env.EXPO_PUBLIC_DATABASE_URL;

      const userResponse = await axios.get(
        `${API_BASE_URL}/users/firebase?firebaseUID=${firebaseUID}`
      );
      const usersId = userResponse.data._id;

      const [currentProgramResponse, userPrograms] = await Promise.all([
        axios.get(`${API_BASE_URL}/workouts/uncompleted/${usersId}`),
        axios.get(`${API_BASE_URL}/workouts?clientId=${usersId}`),
      ]);

      setUserProgramData(userPrograms.data);

      const completedPrograms = userPrograms.data.filter(
        (program) => program.completed === true
      );

      const completedWorkouts = completedPrograms.map((program) => ({
        programName: program.programName,
        date: new Date(program.updatedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }));

      setCompletedWorkouts(completedWorkouts);
      setCompletedPrograms(completedPrograms);
      setUser(userResponse.data);
      setUsersCurrentProgram(currentProgramResponse.data);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      Alert.alert("Error", "Failed to load user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleStartWorkout = () => {
    router.push("/(tabs)/workouts/");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {usersCurrentProgram[0].programName || "No Program Available"}
          </Text>
          <Text style={styles.cardSubtitle}>
            Week {usersCurrentProgram[0].currentWeek || "N/A"} of{" "}
            {usersCurrentProgram[0].weeks?.length || "N/A"} | Day{" "}
            {usersCurrentProgram[0].currentDay || "N/A"}
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartWorkout}
          >
            <Text style={styles.primaryButtonText}>Start Today’s Workout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>No Program Found</Text>
        </View>
      )}

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {completedPrograms.length || "N/A"}
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
      <View>
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
    backgroundColor: "#0f172a", // Slate-900
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  loadingText: {
    color: "#94a3b8", // Slate-400
    marginTop: 10,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    color: "#f8fafc", // Slate-50
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1e293b", // Slate-800
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    color: "#f8fafc", // Slate-50
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubtitle: {
    color: "#94a3b8", // Slate-400
    fontSize: 14,
    marginVertical: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: "#1e293b", // Slate-800
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  statValue: {
    color: "#f8fafc", // Slate-50
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#94a3b8", // Slate-400
    fontSize: 12,
  },
  sectionTitle: {
    color: "#f8fafc", // Slate-50
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyCard: {
    backgroundColor: "#1e293b", // Slate-800
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyDate: {
    color: "#94a3b8", // Slate-400
    fontSize: 14,
  },
  historySummary: {
    color: "#f8fafc", // Slate-50
    fontSize: 16,
  },
  noHistoryText: {
    color: "#94a3b8", // Slate-400
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: "#6366F1", // Indigo-500
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  primaryButtonText: {
    color: "#f8fafc", // Slate-50
    fontSize: 16,
    fontWeight: "bold",
  },
});
