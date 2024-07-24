import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { Task, useDevices } from "../DevicesContext";
import uuid from "react-native-uuid";


export default function TaskScheduler() {
  const { devices } = useDevices();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [time, setTime] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<(string | number[])[]>(
    []
  );

  const handleAddTask = () => {
    if (!time || selectedDevices.length === 0) {
      alert("Please provide a time and select at least one device.");
      return;
    }

    setTasks((prevTasks) => [
      ...prevTasks,
      {
        id: uuid.v4(),
        time,
        devices: selectedDevices,
      },
    ]);
    setTime("");
    setSelectedDevices([]);
  };

  const toggleDeviceSelection = (deviceId: string | number[]) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTime}>{item.time}</Text>
      <Text>Devices: {item.devices.join(", ")}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Scheduler</Text>
      <TextInput
        style={styles.input}
        value={time}
        onChangeText={setTime}
        placeholder="Enter time (HH:MM)"
        placeholderTextColor="gray"
      />
      <Text>Select Devices:</Text>
      {devices.map((device) => (
        <Pressable
          key={device.id.toString()}
          style={[
            styles.deviceItem,
            {
              backgroundColor: selectedDevices.includes(device.id)
                ? "#e0e0e0"
                : "#f9f9f9",
            },
          ]}
          onPress={() => toggleDeviceSelection(device.id)}
        >
          <Text>{device.name}</Text>
        </Pressable>
      ))}
      <Button title="Add Task" onPress={handleAddTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.time}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  deviceItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  taskItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  taskTime: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
