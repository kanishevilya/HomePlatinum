import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Alert,
  FlatList,
} from "react-native";
import Icon from "../components/Icon";
import { Room, Section, useRooms } from "../RoomsContext";

export default function RemoveRoomSection({ navigation, route }: any) {
  const { id } = route.params || null;
  //   alert(id);
  const {
    rooms,
    sections,
    removeSection,
    getUnassignedRooms,
    removeRoomFromSection,
  } = useRooms();
  const [unassignedRooms, setUnassignedRooms] = useState(0);
  const [selectedSection, setSelectedSection] = useState<
    string | number[] | null
  >(id);
  const [removeSwitcher, setRemoveSwitcher] = useState(false); // для useEffect

  const [canBeRemove, setCanBeRemove] = useState(false);

  const [selectedRooms, setSelectedRooms] = useState<(string | number[])[]>([]);

  useEffect(() => {
    setUnassignedRooms(getUnassignedRooms().length);
  }, [removeSwitcher]);

  const handleRemovePress = (sectionId: string | number[]) => {
    const section = sections.find((sec) => sec.id === sectionId);

    if (!section) return;

    if (section.roomIds.length > 0 && !canBeRemove) {
      setCanBeRemove(true);
      Alert.alert(
        "Sections contain rooms.",
        "Click again if you want to move the rooms to 'Unassigned' and delete sections.",
        [{ text: "OK" }]
      );
      return;
    }

    removeSection(sectionId);
    setSelectedSection(null);
    setRemoveSwitcher(!removeSwitcher);
  };

  const toggleRoomSelect = (roomId: string | number[]) => {
    setSelectedRooms((prevSelected) =>
      prevSelected.includes(roomId)
        ? prevSelected.filter((id) => id !== roomId)
        : [...prevSelected, roomId]
    );
  };

  const handleMoveToUnassigned = () => {
    selectedRooms.forEach((roomId) => {
      removeRoomFromSection(roomId, selectedSection ?? "");
    });
    setSelectedRooms([]);
    setRemoveSwitcher(!removeSwitcher);
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
      onPress={() => toggleRoomSelect(item.id)}
    >
      <Text style={styles.roomText}>{item.name}</Text>
    </Pressable>
  );

  const renderSection = (listItem: { index: number; item: Section }) => {
    const item = listItem.item;
    return (
      <View
        style={
          listItem.index == sections.length - 1
            ? [styles.sectionContainer, { marginBottom: 10 }]
            : styles.sectionContainer
        }
      >
        <Pressable
          style={[
            styles.sectionItem,
            {
              backgroundColor:
                selectedSection === item.id ? "#e0e0e0" : "#f9f9f9",
            },
          ]}
          onPress={() => {
            if (selectedSection == item.id) {
              setSelectedSection(null);
            } else {
              setSelectedSection(item.id);
            }
            setSelectedRooms([]);
          }}
        >
          {item.roomIds.length > 0 && selectedSection === item.id && (
            <Icon
              name="warning"
              color="#ff4d4d"
              size={24}
              addStyle={styles.warningIcon}
            />
          )}
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>{item.name}</Text>
            <Text style={styles.roomCount}>{item.roomIds.length} rooms</Text>
          </View>
          {selectedSection === item.id && (
            <Pressable
              style={styles.removeButton}
              onPress={() => handleRemovePress(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </Pressable>
          )}
        </Pressable>
        {item.roomIds.length > 0 && selectedSection === item.id && (
          <FlatList
            data={rooms.filter((room) => room.sectionIds.includes(item.id))}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderRoom}
            style={{ paddingHorizontal: 40 }}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.goBackContainer}
      >
        <Icon name="arrow-circle-left" color="#23282C" size={42} />
        <Text style={styles.goBackText}>Go Back</Text>
      </Pressable>
      <Text style={styles.title}>Remove Room Sections</Text>
      <View>
        <FlatList
          data={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item) => renderSection(item)}
          style={styles.list}
        />
        {selectedRooms.length > 0 && (
          <Pressable style={styles.moveButton} onPress={handleMoveToUnassigned}>
            <Text style={styles.moveButtonText}>Move to Unassigned</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.sectionContainerUnassigned}>
        <Pressable
          style={[
            styles.sectionItem,
            {
              backgroundColor: "#23282C",
            },
          ]}
          onPress={() => navigation.navigate("AddRoomSection")}
        >
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTextUnassigned}>Unassigned Rooms</Text>
            <Text style={styles.roomCountUnassigned}>
              {unassignedRooms} rooms
            </Text>
          </View>
          <Icon
            name="expand"
            color="white"
            size={30}
            addStyle={{ marginRight: 10 }}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  moveButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 30,
    marginBottom: -10,
    alignItems: "center",
  },
  moveButtonText: {
    color: "white",
    fontSize: 16,
  },
  roomItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginVertical: 10,
  },
  roomText: {
    fontSize: 18,
    color: "#23282C",
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
  sectionContainer: {
    marginVertical: 10,
  },
  sectionContainerUnassigned: {
    marginTop: 50,
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
  sectionText: {
    fontSize: 18,
    color: "#23282C",
  },
  sectionTextUnassigned: {
    fontSize: 18,
    color: "white",
  },
  roomCount: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  roomCountUnassigned: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  warningIcon: {
    marginRight: 15,
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
  },
  list: {
    marginTop: 20,
    height: 410,
  },
});
