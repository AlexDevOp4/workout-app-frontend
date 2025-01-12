import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useUserContext } from "../../UserContext";

export default function ProgressTrackerPage() {
  const router = useRouter();
  const { user } = useUserContext();

  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completedWorkouts: 0,
    totalExercises: 0,
    avgWeightLifted: 0,
  });

  const calculateProgress = (data) => {
    let totalExercises = 0;
    let totalWeight = 0;
    let totalWeightEntries = 0;

    data.forEach((program) => {
      program.weeks.forEach((week) => {
        week.days.forEach((day) => {
          day.exercises.forEach((exercise) => {
            totalExercises++;
            if (exercise.weight) {
              totalWeight += exercise.weight;
              totalWeightEntries++;
            }
          });
        });
      });
    });

    const avgWeightLifted =
      totalWeightEntries > 0 ? totalWeight / totalWeightEntries : 0;

    return { totalExercises, avgWeightLifted };
  };

  const fetchProgressData = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DATABASE_URL}/workouts?clientId=${user._id}`
      );
      const data = await response.json();

      const completedPrograms = data.filter(
        (program) => program.completed === true
      );

      const { totalExercises, avgWeightLifted } = calculateProgress(data);

      const progressData = data
        .map((program) => {
          return program.weeks.map((week) => {
            const totalWeightLifted = week.days.reduce((total, day) => {
              return (
                total +
                day.exercises.reduce((dayTotal, exercise) => {
                  if (exercise.actualReps && exercise.actualReps.length > 0) {
                    const reps = exercise.actualReps.reduce(
                      (sum, rep) => sum + rep,
                      0
                    );
                    return dayTotal + reps * exercise.weight;
                  }
                  return dayTotal;
                }, 0)
              );
            }, 0);

            const totalExercises = week.days.reduce((total, day) => {
              return (
                total +
                day.exercises.filter(
                  (exercise) =>
                    exercise.actualReps && exercise.actualReps.length > 0
                ).length
              );
            }, 0);

            const avgWeightLifted =
              totalExercises > 0 ? totalWeightLifted / totalExercises : 0;

            return {
              week: week.weekNumber,
              avgWeightLifted,
              totalWeightLifted,
            };
          });
        })
        .flat();

      setProgressData(progressData || []);
      setStats({
        completedWorkouts: completedPrograms.length || 0,
        totalExercises: totalExercises || 0,
        avgWeightLifted: avgWeightLifted || 0,
      });
    } catch (error) {
      console.error("Error fetching progress data:", error);
      Alert.alert("Error", "Failed to load progress data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Progress...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Progress Tracker</Text>

      {/* KPI Section */}
      <View style={styles.kpiContainer}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{stats.completedWorkouts}</Text>
          <Text style={styles.kpiLabel}>Completed Workouts</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{stats.totalExercises}</Text>
          <Text style={styles.kpiLabel}>Total Exercises</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>
            {stats.avgWeightLifted.toFixed(2)} lbs
          </Text>
          <Text style={styles.kpiLabel}>Avg. Weight Lifted</Text>
        </View>
      </View>

      {/* Workout Progress Over Time */}
      <Text style={styles.sectionTitle}>Workout Progress Over Time</Text>
      <ScrollView horizontal style={styles.chartScroll}>
        <View style={styles.chartContainer}>
          {progressData.map((entry, index) => (
            <View key={index} style={styles.barContainer}>
              <Text style={styles.barLabel}>Week {entry.week}</Text>
              <View
                style={[styles.bar, { height: entry.totalWeightLifted / 10 }]} // Scaling for bar height
              >
                <Text style={styles.barText}>
                  {Math.round(entry.totalWeightLifted)} lbs
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Weight Progression */}
      <Text style={styles.sectionTitle}>Weight Progression</Text>
      <ScrollView horizontal style={styles.chartScroll}>
        <View style={styles.chartContainer}>
          {progressData.map((entry, index) => (
            <View key={index} style={styles.dotContainer}>
              <Text style={styles.barLabel}>Week {entry.week}</Text>
              <View
                style={[
                  styles.dot,
                  {
                    bottom: entry.avgWeightLifted / 2, // Adjust scaling
                    left: index * 50, // Adjust spacing
                  },
                ]}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/index")}
      >
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F2937",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F9FAFB",
    textAlign: "center",
    marginBottom: 20,
  },
  kpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  kpiCard: {
    backgroundColor: "#374151",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F9FAFB",
  },
  kpiLabel: {
    fontSize: 14,
    color: "#D1D5DB",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F9FAFB",
    marginBottom: 10,
    textAlign: "center",
  },
  chartScroll: {
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 150,
    position: "relative",
  },
  barContainer: {
    alignItems: "center",
    marginHorizontal: 10,
    Top: 10,
  },
  barLabel: {
    fontSize: 12,
    color: "#D1D5DB",
    marginBottom: 5,
  },
  bar: {
    width: 30,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  barText: {
    fontSize: 10,
    color: "#F9FAFB",
  },
  dotContainer: {
    position: "absolute",
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    position: "absolute",
  },
  backButton: {
    backgroundColor: "#6366F1",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F2937",
  },
  loadingText: {
    color: "#F9FAFB",
    marginTop: 10,
  },
});
