import React from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Pressable,
  StyleSheet,
} from "react-native";
import { Device, useDevices } from "../DevicesContext";
import { useRooms } from "../RoomsContext";
import Icon from "../components/Icon";

export default function RoomDevices({ navigation, route }: any) {
  const { roomId } = route.params || "";
  const { getDevicesInRoom } = useRooms();
  const { devices } = useDevices();
  console.log(roomId);
  console.log(devices);
  console.log(getDevicesInRoom(roomId));
  const devicesInRoom = getDevicesInRoom(roomId)
    .map((deviceId) => devices.find((device) => device.id === deviceId))
    .filter((device) => device !== undefined) as Device[];

  return (
    <View>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.goBackContainer}
      >
        <Icon name="arrow-circle-left" color="#23282C" size={42} />
        <Text style={styles.goBackText}>Go Back</Text>
      </Pressable>
      <Text>Devices in Room:</Text>
      <FlatList
        data={devicesInRoom}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={()=>navigation.navigate("Device", {"deviceId": item.id})}>
            <View>
              <Text>{item.name}</Text>
            </View>
          </Pressable>
        )}
      />
      <Button
        title="AddNewDevice"
        onPress={() => navigation.navigate("DeviceConstructor")}
      />
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
});
