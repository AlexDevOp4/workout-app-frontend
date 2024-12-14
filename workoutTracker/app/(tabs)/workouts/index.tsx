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
  const [selectedWeek, setSelectedWeek] = useState("1"); // Default to Week 1
  const [userProgram, setUsersProgram] = useState<any[]>([]);
  const [week, setWeek] = useState<any[]>([]);
  const [day, setDay] = useState<any[]>([]);
  const router = useRouter();
  console.log(user?._id);

  useEffect(() => {
    // Side effect logic here, such as fetching data
    const getUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/workoutlogs/${user?._id}`
        );

        console.log(response.data.workoutId[0]["weeks"][0]["weekNumber"]);

        let usersProgramArray = [];
        usersProgramArray.push(response.data);

        const normalizeData = (data) => (Array.isArray(data) ? data : [data]);

        normalizeData(response.data);

        setUsersProgram(normalizeData(response.data.workoutId[0]));
        let weeks = [];
        for (
          let i = 0;
          i < response.data.workoutId[0]["weeks"][0]["weekNumber"];
          i++
        ) {
          weeks.push(`Week ${i + 1}`);
        }

        setWeek(weeks);

        let days = [];

        for (
          let i = 0;
          i < response.data.workoutId[0]["weeks"][0].days.length;
          i++
        ) {
          days.push(`Day ${i + 1}`);
        }

        setDay(days);
      } catch (error) {
        console.error("Error fetching user:", error);
        Alert.alert("Error", "Error fetching user.");
      }
    };
    getUser();

    // Optional cleanup function
    return () => {
      console.log("Cleanup logic, if needed.");
    };
  }, []); // Dependency array

  const days = ["Day 1", "Day 2", "Day 3", "Day 4"];

  return (
    <View style={styles.container}>
      {/* Week Dropdown */}
      <Text style={styles.title}>Select a Week</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={selectedWeek}
          onValueChange={(itemValue) => setSelectedWeek(itemValue)}
        >
          <Picker.Item label="Week 1" value="1" />
          <Picker.Item label="Week 2" value="2" />
          <Picker.Item label="Week 3" value="3" />
          <Picker.Item label="Week 4" value="4" />
        </Picker>
      </View>

      {/* Days List */}
      <Text style={styles.subtitle}>Days for Week {selectedWeek}</Text>
      <FlatList
        data={days}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dayButton}
            onPress={() =>
              router.push(`/workouts/${item}-${selectedWeek}`)
            }
          >
            <Text style={styles.dayButtonText}>{item}</Text>
          </TouchableOpacity>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  dayButton: {
    padding: 15,
    backgroundColor: "#3b5998",
    borderRadius: 8,
    marginBottom: 10,
  },
  dayButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
