import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useUserContext } from "../../UserContext";

export default function Workouts() {
  const { user } = useUserContext();
  const [selectedWeek, setSelectedWeek] = useState();
  const [weeks, setWeeks] = useState([]);
  const [days, setDays] = useState([]);
  const [usersData, setUsersData] = useState("");
  const [viewData, setViewData] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProgram = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/workouts/uncompleted/${user._id}`
        );
        setViewData(true);

        const responseData = response.data;
        setSelectedWeek(String(responseData[0]["currentWeek"]));
        setUsersData(responseData[0]["programName"]);

        const weeksData = responseData[0]?.weeks || [];
        setWeeks(weeksData);

        const initialWeek = weeksData.find(
          (week) => String(week.weekNumber) === responseData[0]["currentWeek"]
        );
        setDays(initialWeek?.days || []);
      } catch (error) {
        setViewData(false);
      }
    };

    if (user?._id) {
      fetchUserProgram();
    }
  }, [user?._id]);

  useEffect(() => {
    const selectedWeekData = weeks.find(
      (week) => String(week.weekNumber) === selectedWeek
    );
    setDays(selectedWeekData?.days || []);
  }, [selectedWeek, weeks]);

  return viewData ? (
    <View style={styles.container}>
      {/* Program Name */}
      <Text style={styles.title}>{usersData}</Text>

      {/* Week Selector */}
      <Text style={styles.subtitle}>Select a Week</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={selectedWeek}
          onValueChange={(itemValue) => setSelectedWeek(itemValue)}
          dropdownIconColor="#fff"
          style={styles.picker}
        >
          {weeks.map((weekItem, index) => (
            <Picker.Item
              color="#fff"
              key={index}
              label={`Week ${weekItem.weekNumber}`}
              value={String(weekItem.weekNumber)}
            />
          ))}
        </Picker>
      </View>

      {/* Days List */}
      <Text style={styles.subtitle}>Days for Week {selectedWeek}</Text>
      <FlatList
        data={days}
        keyExtractor={(item, index) => `${selectedWeek}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dayButton}
            onPress={() =>
              router.push(`/workouts/${item.dayNumber}-${selectedWeek}`)
            }
          >
            <Text style={styles.dayButtonText}>Day {item.dayNumber}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  ) : (
    <View style={styles.unassigned}>
      <Text style={styles.noWorkoutText}>No Workout Assigned!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    color: "#aaa",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    backgroundColor: "#333",
    marginBottom: 20,
    color: "#fff",
  },
  picker: {
    color: "#fff",
  },
  dayButton: {
    padding: 15,
    backgroundColor: "#6366F1",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  dayButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  unassigned: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  noWorkoutText: {
    color: "#aaa",
    fontSize: 20,
    fontWeight: "bold",
  },
});
