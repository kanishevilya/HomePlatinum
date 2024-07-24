import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";
import { useDevices } from "../DevicesContext";
import { Section, useRooms } from "../RoomsContext";
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
  const { rooms, addDeviceToRoom, sections } = useRooms();
  const [deviceName, setDeviceName] = useState("");
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<(string | number[])[]>([]);

  const [selectedSection, setSelectedSection] = useState<
    string | number[] | null
  >(null);

  const toggleRoomSelect = (roomId: string | number[]) => {
    setSelectedRooms((prevSelected) =>
      prevSelected.includes(roomId)
        ? prevSelected.filter((id) => id !== roomId)
        : [...prevSelected, roomId]
    );
  };

  const toggleFunction = (func: string) => {
    setSelectedFunctions((prev) =>
      prev.includes(func) ? prev.filter((f) => f !== func) : [...prev, func]
    );
  };

  const handleCreateDevice = () => {
    for (let i = 0; i < selectedRooms.length; i++) {
      const deviceId = addDevice(
        deviceName,
        selectedFunctions as any,
        selectedRooms[i]
      );
      addDeviceToRoom(selectedRooms[i], deviceId);
    }
    setDeviceName("");
    setSelectedFunctions([]);
    setSelectedRooms([]);
    navigation.goBack();
  };

  const renderSection = (section: Section) => {
    return (
      <Pressable
        style={[
          styles.sectionItem,
          {
            backgroundColor:
              selectedSection === section.id ? "#e0e0e0" : "#f9f9f9",
          },
        ]}
        onPress={() => {
          if (selectedSection === section.id) {
            setSelectedSection(null);
          } else {
            setSelectedSection(section.id);
          }
        }}
      >
        <Text style={styles.sectionText}>{section.name}</Text>
      </Pressable>
    );
  };

  let filteredRooms = selectedSection
    ? rooms.filter((room) => room.sectionIds.includes(selectedSection))
    : rooms;

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
      <View style={styles.sectionsContainer}>
        <FlatList
          horizontal
          data={sections}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderSection(item)}
          style={styles.sectionsList}
        />
      </View>
      <View>
        {filteredRooms.map((room) => (
          <Pressable
            key={room.id.toString()}
            style={[
              styles.functionItem,
              {
                backgroundColor: selectedRooms.includes(room.id)
                  ? "#e0e0e0"
                  : "#f9f9f9",
              },
            ]}
            onPress={() => {
              toggleRoomSelect(room.id);
            }}
          >
            <Text style={styles.functionText}>{room.name}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.btn} onPress={handleCreateDevice}>
        <Text style={styles.btnText}>Create Device</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 5,
    backgroundColor: "#23282C",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
  goBackContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 40,
    marginTop: 40,
  },
  sectionsContainer: {
    marginBottom: 20,
  },
  sectionsList: {
    marginBottom: 10,
  },
  sectionItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  sectionText: {
    fontSize: 16,
    color: "#23282C",
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
