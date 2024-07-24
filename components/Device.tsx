import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
} from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import { useDevices } from "../DevicesContext";
import Icon from "./Icon";
import Slider from "@react-native-community/slider";

interface DeviceProps {
  deviceId: string | number[];
}

export function Device({ navigation, route }: any) {
  const { deviceId } = route.params || "";
  const { devices, updateDeviceState, setTimer } = useDevices();
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
    const minutes = Number(timerValue);
    if (!isNaN(minutes)) {
      const now = new Date();
      const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
      const targetTimeInMinutes = currentTimeInMinutes + minutes;
      console.log(targetTimeInMinutes);
      const onTime = device.state.isOn ? undefined : targetTimeInMinutes;
      const offTime = device.state.isOn ? targetTimeInMinutes : undefined;
      console.log({ onTime, offTime });

      setTimer(deviceId, { onTime, offTime });
      setTimerValue("");
    }
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
      <View style={styles.deviceContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.deviceName}>{device.name}</Text>
          <Switch
            value={device.state.isOn}
            onValueChange={handleSwitchChange}
          />
        </View>
        {device.functions.includes("brightness") && (
          <View style={styles.sliderView}>
            <Text>Brightness</Text>
            <Slider
              thumbTintColor="gray"
              minimumTrackTintColor="darkgray"
              style={{ width: 200, height: 40 }}
              value={device.state.brightness || 50}
              onValueChange={(value) =>
                updateDeviceState(deviceId, { brightness: value })
              }
              step={10}
              minimumValue={20}
              maximumValue={100}
            />
            <Text>{device.state.brightness || 50}</Text>
          </View>
        )}
        {device.functions.includes("color") && (
          <View>
            <Text>Color</Text>
            {/* <ColorPicker
            color={device.state.color || '#ffffff'}
            onColorSelected={(color) => updateDeviceState(deviceId, { color })}
            style={{ flex: 1, height: 200 }}
          /> */}
          </View>
        )}
        {device.functions.includes("humidity") && (
          <View style={styles.sliderView}>
            <Text>Humidity</Text>
            <Slider
              thumbTintColor="gray"
              minimumTrackTintColor="darkgray"
              style={{ width: 200, height: 40 }}
              value={device.state.humidity || 0}
              onValueChange={(value) =>
                updateDeviceState(deviceId, { humidity: value })
              }
              step={10}
              minimumValue={0}
              maximumValue={100}
            />
            <Text>{device.state.humidity || 0}</Text>
          </View>
        )}
        {device.functions.includes("temperature") && (
          <View style={styles.sliderView}>
            <Text>Temperature</Text>
            <Slider
              thumbTintColor="gray"
              minimumTrackTintColor="darkgray"
              style={{ width: 200, height: 20 }}
              value={device.state.temperature || 0}
              onValueChange={(value) =>
                updateDeviceState(deviceId, { temperature: value })
              }
              step={1}
              minimumValue={15}
              maximumValue={30}
            />
            <Text>{device.state.temperature || 15}</Text>
          </View>
        )}
        {device.functions.includes("timer") && (
          <View>
            {/* <Text>{currentTimeInMinutes}</Text> */}
            {/* <Text>{JSON.stringify(device.timerSettings)}</Text> */}
            <Text>Timer (minutes)</Text>
            {(device.timerSettings?.onTime ||
              device.timerSettings?.offTime) && (
              <Text>
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
              //   placeholder={}
            />
            <Button title="Set Timer" onPress={handleSetTimer} />
          </View>
        )}
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
  sliderView: {
    flexDirection: "row",
    alignItems: "center",
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
    borderRadius: 5,
    borderColor: "#ccc",
  },
  deviceName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
