import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useDevices } from "../DevicesContext";
import Icon from "./Icon";
import Slider from "@react-native-community/slider";
import { useRooms } from "../RoomsContext";

interface DeviceProps {
  deviceId: string | number[];
}

export function Device({ navigation, route }: any) {
  const { deviceId } = route.params || "";
  const { devices, updateDeviceState, setTimer, removeDevice } = useDevices();
  const {removeDeviceFromRoom}=useRooms();
  const device = devices.find((d) => d.id === deviceId);
  const [timerValue, setTimerValue] = useState("");
  const [currentTimeInMinutes, setCurrentTimeInMinutes] = useState(
    new Date().getHours() * 60 + new Date().getMinutes()
  );

  if (!device) return null;

  const handleSwitchChange = () => {
    updateDeviceState(deviceId, { isOn: !device.state.isOn });
  };

  const handleTimerChange = (value: string) => {
    setTimerValue(value);
  };
  function removeHandle(){
    removeDeviceFromRoom(deviceId, device?.roomId || "");
    removeDevice(deviceId);
    navigation.goBack();
  }

  useEffect(() => {
    const intervalId = setInterval(
      () =>
        setCurrentTimeInMinutes(
          new Date().getHours() * 60 + new Date().getMinutes()
        ),
      1000
    );
    return () => clearInterval(intervalId);
  }, [devices]);

  const handleSetTimer = () => {
    if (!timerValue.trim()) {
      return;
    }
    const minutes = Number(timerValue);
    if (!isNaN(minutes) && minutes >= 1) {
      const now = new Date();
      const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
      const targetTimeInMinutes = currentTimeInMinutes + minutes;
      const onTime = device.state.isOn ? undefined : targetTimeInMinutes;
      const offTime = device.state.isOn ? targetTimeInMinutes : undefined;

      setTimer(deviceId, { onTime, offTime });
      setTimerValue("");
    }
  };
  function handleToColorNavigate(typeOfFunc: string) {
    navigation.navigate("ColorPalette", {
      deviceId: deviceId,
      typeOfFunc: typeOfFunc,
    });
  }

  return (
    <ScrollView style={styles.container}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.goBackContainer}
      >
        <Icon name="arrow-circle-left" color="#23282C" size={42} />
        <Text style={styles.goBackText}>Go Back</Text>
      </Pressable>
      <View style={styles.deviceContainer}>
        <View style={styles.deviceHeader}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <Switch
            value={device.state.isOn}
            onValueChange={handleSwitchChange}
          />
        </View>
        {device.functions.includes("brightness") && (
          <View style={styles.sliderView}>
            <Text style={styles.label}>Brightness</Text>
            <Slider
              thumbTintColor="gray"
              minimumTrackTintColor="darkgray"
              style={styles.slider}
              value={device.state.brightness || 50}
              onValueChange={(value) =>
                updateDeviceState(deviceId, { brightness: value })
              }
              step={10}
              minimumValue={20}
              maximumValue={100}
            />
            <Text style={styles.valueText}>
              {device.state.brightness || 50}
            </Text>
          </View>
        )}
        {device.functions.includes("color") && (
          <View>
            <Text style={[styles.label, { paddingTop: 10 }]}>Color</Text>
            <Pressable
              onPress={() => handleToColorNavigate("color")}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Select color</Text>
            </Pressable>
            {device.state.color && (
              <>
                <View
                  style={[
                    styles.colorView,
                    { backgroundColor: device.state.color },
                  ]}
                ></View>
                <Pressable
                  onPress={() => {
                    updateDeviceState(deviceId, { color: undefined });
                  }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </Pressable>
              </>
            )}
          </View>
        )}
        {device.functions.includes("backlight") && (
          <View>
            <Text style={[styles.label, { paddingTop: 10 }]}>Backlight</Text>
            <Pressable
              onPress={() => handleToColorNavigate("backlight")}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Select backlight</Text>
            </Pressable>
            {device.state.backlight && (
              <>
                <View
                  style={[
                    styles.colorView,
                    { backgroundColor: device.state.backlight },
                  ]}
                ></View>
                <Pressable
                  onPress={() => {
                    updateDeviceState(deviceId, { backlight: undefined });
                  }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </Pressable>
              </>
            )}
          </View>
        )}
        {device.functions.includes("humidity") && (
          <View style={styles.sliderView}>
            <Text style={styles.label}>Humidity</Text>
            <Slider
              thumbTintColor="gray"
              minimumTrackTintColor="darkgray"
              style={styles.slider}
              value={device.state.humidity || 0}
              onValueChange={(value) =>
                updateDeviceState(deviceId, { humidity: value })
              }
              step={5}
              minimumValue={0}
              maximumValue={80}
            />
            <Text style={styles.valueText}>{device.state.humidity}</Text>
          </View>
        )}
        {device.functions.includes("temperature") && (
          <View style={styles.sliderView}>
            <Text style={styles.label}>Temperature</Text>
            <Slider
              thumbTintColor="gray"
              minimumTrackTintColor="darkgray"
              style={styles.slider}
              value={device.state.temperature || 0}
              onValueChange={(value) =>
                updateDeviceState(deviceId, { temperature: value })
              }
              step={1}
              minimumValue={15}
              maximumValue={30}
            />
            <Text style={styles.valueText}>{device.state.temperature}</Text>
          </View>
        )}

        {device.functions.includes("timer") && (
          <View style={{ minHeight: 180, maxHeight: 180, marginVertical: 15 }}>
            <Text style={styles.label}>Timer (minutes)</Text>
            {(device.timerSettings?.onTime ||
              device.timerSettings?.offTime) && (
              <Text style={styles.valueText}>
                {(
                  (device.timerSettings?.onTime
                    ? device.timerSettings?.onTime
                    : device.timerSettings?.offTime || 0) - currentTimeInMinutes
                ).toString()}
              </Text>
            )}
            <TextInput
              keyboardType="numeric"
              value={timerValue}
              onChangeText={handleTimerChange}
              style={styles.input}
            />
            <Pressable onPress={handleSetTimer} style={styles.button}>
              <Text style={styles.buttonText}>Set Timer</Text>
            </Pressable>
          </View>
        )}
      </View>
      <Pressable onPress={removeHandle} style={[styles.button, {marginTop: -30, marginBottom: 40}]}>
        <Text style={styles.buttonText}>Remove</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  colorView: {
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    marginVertical: 10,
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
  deviceContainer: {
    padding: 20,
    margin: 10,
    borderWidth: 1,
    borderRadius: 24,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    elevation: 4,
    marginBottom: 50,
  },
  deviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  deviceName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#23282C",
  },
  sliderView: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    color: "#23282C",
    flex: 1.5,
  },
  slider: {
    width: 140,
    height: 40,
    // flex: 3,
  },
  valueText: {
    fontSize: 18,
    color: "#23282C",
    // flex: 1,
    width: 40,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    fontSize: 18,
    color: "#23282C",
  },
  button: {
    backgroundColor: "#23282C",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
