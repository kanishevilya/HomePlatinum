import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import { useDevices } from "../DevicesContext";
import { useRooms } from "../RoomsContext";
import Icon from "../components/Icon";

const availableFunctions = [
  "brightness",
  "color",
  "humidity",
  "temperature",
  "backlight",
  "timer",
];

export default function DeviceConstructor({ navigation }: any) {
  const { addDevice } = useDevices();
  const { rooms, addDeviceToRoom} = useRooms();
  const [deviceName, setDeviceName] = useState("");
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | number[] | null>(
    null
  );

  const toggleFunction = (func: string) => {
    setSelectedFunctions((prev) =>
      prev.includes(func) ? prev.filter((f) => f !== func) : [...prev, func]
    );
  };

  const handleCreateDevice = () => {
    const deviceId=addDevice(deviceName, selectedFunctions as any, selectedRoom);
    if(selectedRoom){
        addDeviceToRoom(selectedRoom, deviceId);
    }
    setDeviceName("");
    setSelectedFunctions([]);
    setSelectedRoom(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.goBackContainer}
      >
        <Icon name="arrow-circle-left" color="#23282C" size={42} />
        <Text style={styles.goBackText}>Go Back</Text>
      </Pressable>
      <Text style={styles.title}>Create New Device</Text>
      <TextInput
        style={styles.input}
        value={deviceName}
        onChangeText={setDeviceName}
        placeholder="Enter Device Name"
        placeholderTextColor="gray"
      />
      {availableFunctions.map((func) => (
        <Pressable
          key={func}
          style={[
            styles.functionItem,
            {
              backgroundColor: selectedFunctions.includes(func)
                ? "#e0e0e0"
                : "#f9f9f9",
            },
          ]}
          onPress={() => toggleFunction(func)}
        >
          <Text style={styles.functionText}>{func}</Text>
        </Pressable>
      ))}
      <Text style={styles.title}>Select Room</Text>
      {rooms.map((room) => (
        <Pressable
          key={room.id.toString()}
          style={[
            styles.functionItem,
            {
              backgroundColor: selectedRoom === room.id ? "#e0e0e0" : "#f9f9f9",
            },
          ]}
          onPress={() => {
            if (selectedRoom === room.id) {
              setSelectedRoom(null);
            } else {
              setSelectedRoom(room.id);
            }
          }}
        >
          <Text style={styles.functionText}>{room.name}</Text>
        </Pressable>
      ))}
      <Button title="Create Device" onPress={handleCreateDevice} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  goBackContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 40,
    marginTop: 40,
  },
  goBackText: {
    fontSize: 24,
    color: "#23282C",
    fontWeight: "700",
    marginLeft: 15,
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
  functionItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  functionText: {
    fontSize: 18,
  },
});
