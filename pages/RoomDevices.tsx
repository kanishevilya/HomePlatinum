import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Pressable,
  StyleSheet,
  ImageBackground,
  Switch,
  Dimensions,
} from "react-native";
import { Device, useDevices } from "../DevicesContext";
import { getDefImg, useRooms } from "../RoomsContext";
import Icon from "../components/Icon";
import { useFocusEffect } from "@react-navigation/native";
import {
  WeatherData,
  WeatherDataLocation,
  WeatherType,
} from "../components/WeatherData";

const { width } = Dimensions.get("window");

export default function RoomDevices({ navigation, route }: any) {
  const { roomId } = route.params || "";
  const { getDevicesInRoom, rooms } = useRooms();
  const { devices, updateDeviceState } = useDevices();

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherType | null>(null);

  const [inDoorTemperature, setInDoorTemperature]= useState(20);
  const [inDoorHumidity, setInDoorHumidity]= useState(50);

  const devicesInRoom = getDevicesInRoom(roomId)
    .map((deviceId) => devices.find((device) => device.id === deviceId))
    .filter((device) => device !== undefined) as Device[];

  const room = rooms.find((r) => r.id === roomId);

  const activeDevicesCount = devicesInRoom.filter((d) => d.state.isOn).length;

  function calcData(){
    let _inDoorTemperature=20;
    let _inDoorHumidity=50;
    devices.forEach((device)=>{
        if(device.state.isOn){
            if(device.state.temperature){
                _inDoorTemperature=(_inDoorTemperature+device.state.temperature)/2;
            }
            if(device.state.humidity && device.state.humidity>0){
                _inDoorHumidity=(_inDoorHumidity+device.state.humidity)/2;
            }
        }
    });
    setInDoorTemperature(_inDoorTemperature);
    // alert(_inDoorTemperature)
    // alert(_inDoorHumidity)
    setInDoorHumidity(_inDoorHumidity);
  }
  useEffect(()=>{
    calcData();
  },[devices]);

  useFocusEffect(
    useCallback(() => {
      console.log(route);
      const fetchWeather = async () => {
        let dataLoc = await WeatherDataLocation();
        if (!dataLoc.Error) {
          let _city = dataLoc[0].name;
          setCity(_city);
          let dataWeather = await WeatherData(_city);
          if (dataWeather) {
            setWeather(dataWeather);
          }
        }
      };
      fetchWeather();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: "#F1F1F1" }]}>
      <View style={styles.topBlock}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.goBackContainer}
        >
          <Icon name="arrow-circle-left" color="#23282C" size={42} />
        </Pressable>
        <Text style={styles.roomName}>{room?.name}</Text>
        <Pressable
          onPress={() => navigation.navigate("DeviceConstructor")}
          style={styles.addButton}
        >
          <Icon name="plus-circle" color="#23282C" size={42} />
        </Pressable>
      </View>

      {room && (
        <ImageBackground
          source={room.image.trim() ? { uri: room.image }: getDefImg()}
          imageStyle={{
            borderRadius: 16,
            borderWidth: 2,
            borderColor: "white",
          }}
          style={styles.weatherSection}
        >
          <View style={styles.activeDevicesBlock}>
            {activeDevicesCount > 0 ? (
              <>
                <View style={styles.activeDevicesBadge} />
                <Text style={styles.activityText}>LIVE</Text>
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.activeDevicesBadge,
                    styles.inactiveDevicesBadge,
                  ]}
                />
                <Text style={styles.activityText}>Inactive</Text>
              </>
            )}
          </View>
          <View style={styles.weatherInfo}>
            <View>
              <Text style={styles.weatherText}>Inside</Text>
              <Text style={styles.weatherSubText}>{inDoorTemperature.toFixed(2)} °C</Text>
            </View>
            <View>
              <Text style={styles.weatherText}>Outside</Text>
              <Text style={styles.weatherSubText}>{weather?.main.temp} °C</Text>
            </View>
            <View>
              <Text style={styles.weatherText}>Humidity</Text>
              <Text style={styles.weatherSubText}>
                {inDoorHumidity.toFixed(2)} %
              </Text>
            </View>
          </View>
        </ImageBackground>
      )}
      <View style={{ height: 400 }}>
        <FlatList
          contentContainerStyle={{ justifyContent: "flex-start" }}
          data={devicesInRoom}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <View
              style={[
                styles.deviceCard,
                item.state.isOn && styles.deviceCardOn,
                item.state.backlight && item.state.isOn ? {shadowColor: item.state.backlight, borderColor: item.state.backlight, borderWidth: 2, elevation: 7}: {}
              ]}
            >
              <View style={styles.cardTop}>
                <Pressable onPress={()=>navigation.navigate("Device", {"deviceId": item.id})}>
                  <Icon
                    name="expand"
                    color={item.state.isOn ? (item.state.color ? item.state.color : "white") : "#767577"}
                    size={40}
                  />
                </Pressable>
                <Switch
                  value={item.state.isOn}
                  thumbColor={item.state.isOn ? (item.state.color ? item.state.color : "darkgray") : "darkgray"}
                  trackColor={{ false: "#767577", true: "white" }}
                  onValueChange={() =>
                    updateDeviceState(item.id, { isOn: !item.state.isOn })
                  }
                />
              </View>
              <Text
                style={[
                  styles.deviceName,
                  item.state.isOn && (item.state.color ? {color: item.state.color} : {color:  "#fff"}),
                ]}
              >
                {item.name}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  cardTop: {
    marginTop: 20,
    width: 110,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activityText: {
    paddingHorizontal: 8,
    color: "white",
    fontSize: 12,
    fontWeight: "400",
  },
  topBlock: {
    width: width,
    height: 142,
    borderRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    elevation: 4,
  },
  goBackContainer: {
    justifyContent: "center",
  },
  goBackText: {
    fontSize: 24,
    color: "#23282C",
    fontWeight: "700",
    marginLeft: 15,
  },
  roomName: {
    fontSize: 24,
    fontWeight: "700",
  },
  addButton: {
    justifyContent: "center",
  },
  weatherSection: {
    width: 326,
    maxWidth: 326,
    height: 169,
    margin: 20,
    borderRadius: 16,

    justifyContent: "flex-end",
    elevation: 4,
  },
  activeDevicesBlock: {
    flexDirection: "row",
    position: "absolute",
    top: 10,
    left: 10,
    // paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 58,
    height: 24,
    borderRadius: 8,
    backgroundColor: "#060606",

    justifyContent: "center",
    alignItems: "center",
    opacity: 0.6,
  },
  activeDevicesBadge: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: "#2AE4A4",
    opacity: 1,
    marginLeft: 8,
  },
  inactiveDevicesBadge: {
    backgroundColor: "#E42A50",
    opacity: 1,
  },
  weatherInfo: {
    height: 66,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    // marginTop: 10,
  },
  weatherText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  weatherSubText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.4,
    paddingTop: 5,
  },
  deviceCard: {
    width: 151,
    height: 151,
    borderRadius: 24,
    margin: 10,
    // justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "white",
    elevation: 4,
    borderColor: "#ccc",
  },
  deviceCardOn: {
    backgroundColor: "#333",
  },
  deviceName: {
    width: 100,
    textAlign: "left",
    fontSize: 16,
    fontWeight: "600",
    color: "#767577",
    paddingTop: 30,
  },
  deviceNameOn: {
    color: "#fff",
  },
});
