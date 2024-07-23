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
import { Room, useRooms } from "../RoomsContext";

export default function RemoveRoom({ navigation }: any) {
  const { rooms, removeRoom } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState<string | number[] | null>(
    null
  );
  const [removeSwitcher, setRemoveSwitcher] = useState(false); // для useEffect

  const handleRemovePress = (roomId: string | number[]) => {
    const room = rooms.find((r) => r.id === roomId);

    if (!room) return;

    if (room.devices.length > 0) {
      Alert.alert(
        "Rooms contain devices.",
        "Click again if you want to delete rooms and move devices to the 'Inactive' section.",
        [{ text: "OK" }]
      );
      return;
    }

    // Удаление комнаты
    removeRoom(roomId);
    setSelectedRoom(null); // Снять выделение комнаты
    setRemoveSwitcher(!removeSwitcher);
  };

  const renderRoom = (listItem: { index: number; item: Room }) => {
    const item = listItem.item;
    return (
      <View
        style={
          listItem.index === rooms.length - 1
            ? [styles.roomContainer, { marginBottom: 10 }]
            : styles.roomContainer
        }
      >
        <Pressable
          style={[
            styles.roomItem,
            {
              backgroundColor: selectedRoom === item.id ? "#e0e0e0" : "#f9f9f9",
            },
          ]}
          onPress={() => setSelectedRoom(item.id)}
        >
          {item.devices.length > 0 && selectedRoom === item.id && (
            <Icon
              name="warning"
              color="#ff4d4d"
              size={24}
              addStyle={styles.warningIcon}
            />
          )}
          <View style={styles.roomContent}>
            <Text style={styles.roomText}>{item.name}</Text>
            <Text style={styles.deviceCount}>
              {item.devices.length} devices
            </Text>
          </View>
          {selectedRoom === item.id && (
            <Pressable
              style={styles.removeButton}
              onPress={() => handleRemovePress(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </Pressable>
          )}
        </Pressable>
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
      <Text style={styles.title}>Remove Rooms</Text>
      <View>
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item) => renderRoom(item)}
          style={styles.list}
        />
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
  roomContainer: {
    marginVertical: 10,
  },
  roomItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  roomContent: {
    flex: 1,
    flexDirection: "column",
  },
  roomText: {
    fontSize: 18,
    color: "#23282C",
  },
  deviceCount: {
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
