import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import Icon from "../components/Icon";
import { useRooms, Section, Room } from "../RoomsContext";

export default function EditSection({ navigation }: any) {
  const {
    sections,
    rooms,
    updateSection,
    getUnassignedRooms,
    addRoomToSection,
  } = useRooms();
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [sectionName, setSectionName] = useState("");
  const [unassignedRooms, setUnassignedRooms] = useState<Room[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<(string | number[])[]>([]);

  useEffect(() => {
    setUnassignedRooms(getUnassignedRooms());
  }, [sections]);

  const handleSectionSelect = (section: Section) => {
    setSelectedSection(section);
    setSectionName(section.name);
  };

  const handleSave = () => {
    if (selectedSection) {
      updateSection(selectedSection.id, { name: sectionName });
      selectedRooms.forEach((roomId) =>
        addRoomToSection(selectedSection.id, roomId)
      );
      navigation.goBack();
    }
  };

  const toggleRoomSelect = (roomId: string | number[]) => {
    setSelectedRooms((prevSelected) =>
      prevSelected.includes(roomId)
        ? prevSelected.filter((id) => id !== roomId)
        : [...prevSelected, roomId]
    );
  };

  const renderSection = ({ item }: { item: Section }) => (
    <Pressable
      style={[
        styles.sectionItem,
        selectedSection?.id === item.id && styles.selectedSection,
      ]}
      onPress={() => handleSectionSelect(item)}
    >
      <Text style={styles.sectionText}>{item.name}</Text>
    </Pressable>
  );

  const renderRoom = ({ item }: { item: Room }) => (
    <Pressable
      style={[
        styles.roomItem,
        selectedRooms.includes(item.id) && styles.selectedRoom,
      ]}
      onPress={() => toggleRoomSelect(item.id)}
    >
      <Text style={styles.roomName}>{item.name}</Text>
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
      <Text style={styles.title}>Edit Section</Text>
      <>
        <FlatList
          data={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSection}
          style={[styles.list, {maxHeight: 70}]}
          horizontal
        />
      </>
      {selectedSection && (
        <>
          <TextInput
            style={styles.input}
            value={sectionName}
            onChangeText={setSectionName}
            placeholder="Section Name"
          />
          {unassignedRooms.length>0 && (
            <>
              <Text style={styles.subtitle}>Add Rooms from Unassigned</Text>
              <FlatList
                data={unassignedRooms}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderRoom}
                style={[styles.list, { height: 365 }]}
              />
            </>
          )}
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  goBackContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#23282C",
  },
  list: {
    minHeight: 70,
    marginVertical: 10,
  },
  sectionItem: {
    height: 60,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedSection: {
    backgroundColor: "#e0e0e0",
  },
  sectionText: {
    fontSize: 18,
    color: "#23282C",
  },
  roomItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedRoom: {
    backgroundColor: "#e0e0e0",
  },
  roomName: {
    fontSize: 18,
    color: "#23282C",
  },
  saveButton: {
    backgroundColor: "#23282C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});
