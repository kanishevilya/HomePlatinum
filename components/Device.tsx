import React, { useState } from "react";
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

interface DeviceProps {
  deviceId: string | number[];
}

export function Device({ navigation, route }: any) {
  const { deviceId } = route.params || "";
  const { devices, updateDeviceState, setTimer } = useDevices();
  const device = devices.find((d) => d.id === deviceId);
  const [timerValue, setTimerValue] = useState("");


  if (!device) return null;

  const handleSwitchChange = () => {
    updateDeviceState(deviceId, { isOn: !device.state.isOn });
  };

  const handleTimerChange = (value: string) => {
    setTimerValue(value);
  };

  const handleSetTimer = () => {
    const minutes = Number(timerValue);
    if (!isNaN(minutes)) {
      setTimer(deviceId, {
        ...device.timerSettings,
        onTime: device.state.isOn ? undefined : minutes,
        offTime: device.state.isOn ? minutes : undefined,
      });
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
        <Text style={styles.deviceName}>{device.name}</Text>
        <Switch value={device.state.isOn} onValueChange={handleSwitchChange} />
        {device.functions.includes("brightness") && (
          <View>
            <Text>Brightness</Text>
            {/* <Slider
            value={device.state.brightness || 50}
            onValueChange={(value) => updateDeviceState(deviceId, { brightness: value })}
            minimumValue={0}
            maximumValue={100}
          /> */}
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
          <View>
            <Text>Humidity</Text>
            {/* <Slider
            value={device.state.humidity || 50}
            onValueChange={(value) => updateDeviceState(deviceId, { humidity: value })}
            minimumValue={0}
            maximumValue={100}
          /> */}
          </View>
        )}
        {device.functions.includes("temperature") && (
          <View>
            <Text>Temperature</Text>
            {/* <Slider
            value={device.state.temperature || 20}
            onValueChange={(value) => updateDeviceState(deviceId, { temperature: value })}
            minimumValue={-20}
            maximumValue={40}
          /> */}
          </View>
        )}
        {device.functions.includes("timer") && (
          <View>
            <Text>Timer (minutes) {(device.timerSettings?.onTime || 0).toString()}</Text>
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
