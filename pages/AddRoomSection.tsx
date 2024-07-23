import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  Alert,
  FlatList,
} from "react-native";
import Icon from "../components/Icon";
import { Room, useRooms } from "../RoomsContext";

export default function AddRoom({ navigation }: any) {
  const [nameOfSection, setNameOfSection] = useState("");
  const [selectedRooms, setSelectedRooms] = useState<(string | number[])[]>([]);
  const { rooms, addSection, getUnassignedRooms, addRoomToSection } =
    useRooms();
  const [unassignedRooms, setUnassignedRooms] = useState(getUnassignedRooms());
  const [displayList, setDisplayList] = useState(false);
  const handleAddPress = async () => {
    const trimmedName = nameOfSection.trim();

    if (trimmedName === "") {
      Alert.alert("Error", "Room Section cannot be empty!");
      return;
    }

    const isDuplicate = rooms.some(
      (room) => room.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert("Error", "Room Section with the same name already exists!");
      return;
    }

    const sectionId = addSection(trimmedName);
    if (sectionId) {
      selectedRooms.forEach((roomId) => {
        addRoomToSection(sectionId, roomId);
      });
    }
    setNameOfSection("");
    setSelectedRooms([]);
    navigation.navigate("Home", { id: sectionId });
  };

  const handleRoomSelect = (roomId: string | number[]) => {
    setSelectedRooms((prevSelected) =>
      prevSelected.includes(roomId)
        ? prevSelected.filter((id) => id !== roomId)
        : [...prevSelected, roomId]
    );
  };

  const renderRoom = ({ item }: { item: Room }) => (
    <Pressable
      style={[
        styles.roomItem,
        {
          backgroundColor: selectedRooms.includes(item.id)
            ? "#e0e0e0"
            : "#f9f9f9",
        },
      ]}
      onPress={() => handleRoomSelect(item.id)}
    >
      <Text style={styles.roomText}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.goBackContainer}
      >
        <Icon name="arrow-circle-left" color="#23282C" size={42} />
        <Text style={styles.goBackText}>Go Back</Text>
      </Pressable>
      <Text style={styles.title}>Room Sections</Text>
      <TextInput
        style={styles.input}
        value={nameOfSection}
        onChangeText={setNameOfSection}
        placeholder="Enter a Room Section"
        placeholderTextColor="gray"
      />

      <View style={styles.sectionContainerUnassigned}>
        <Pressable
          style={[
            styles.sectionItem,
            {
              backgroundColor: "#23282C",
            },
          ]}
          onPress={()=>setDisplayList(!displayList)}
        >
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTextUnassigned}>Unassigned Rooms</Text>
            <Text style={styles.roomCountUnassigned}>
              {unassignedRooms.length} rooms
            </Text>
          </View>
          <Icon name={displayList ? 'angle-down' : 'angle-up'}  color="white" size={40} addStyle={{marginRight: 10}}/>
        </Pressable>
      </View>
      {/* <Text style={styles.subTitle}>Select Unassigned Rooms</Text> */}
      <FlatList
        data={displayList ? unassignedRooms : []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRoom}
        style={styles.list}
      />
      <Pressable style={styles.btn} onPress={handleAddPress}>
        <Text style={styles.btnText}>Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  sectionContainerUnassigned: {
    marginTop: 10,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  sectionContent: {
    flex: 1,
    flexDirection: "column",
  },
  sectionTextUnassigned: {
    fontSize: 18,
    color: "white",
  },
  roomCountUnassigned: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
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
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#23282C",
  },
  subTitle: {
    fontSize: 20,
    color: "#23282C",
    marginBottom: 10,
  },
  input: {
    height: 50,
    width: "100%",
    textAlign: "left",
    fontSize: 18,
    color: "#23282C",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  list: {
    marginTop: 20,
    marginBottom: 20,
  },
  roomItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  roomText: {
    fontSize: 18,
    color: "#23282C",
  },
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 5,
    backgroundColor: "#23282C",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
});
