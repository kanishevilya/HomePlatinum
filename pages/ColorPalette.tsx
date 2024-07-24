import React, { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, View, Text } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import { useDevices } from "../DevicesContext";
import Icon from "../components/Icon";

export default function ColorPalette({ navigation, route }: any) {
  const { updateDeviceState } = useDevices();
  const { deviceId, typeOfFunc } = route.params || "";

  const [color, setColor] = useState("");

  const onColorChange = (color: string) => {
    setColor(color);
  };

  function handleToColorNavigate() {
    if(typeOfFunc=="color"){
      updateDeviceState(deviceId, { color: color });
    }else if(typeOfFunc=="backlight"){
      updateDeviceState(deviceId, {backlight: color});
    }
    navigation.goBack();
    // alert(color);
  }
  return (
    <SafeAreaView style={{ paddingHorizontal: 24 }}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.goBackContainer}
      >
        <Icon name="arrow-circle-left" color="#23282C" size={42} />
        <Text style={styles.goBackText}>Go Back</Text>
      </Pressable>
      <View style={styles.sectionContainer}>
        <ColorPicker
          color={color}
          onColorChange={(color) => onColorChange(color)}
          // onColorChangeComplete={color => alert(`Color selected: ${color}`)}
          thumbSize={40}
          sliderSize={50}
          noSnap={true}
          row={false}
        />
      </View>
      <Pressable onPress={handleToColorNavigate} style={styles.button}>
        <Text style={styles.buttonText}>Save color</Text>
      </Pressable>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 70,
    // paddingHorizontal: 24,
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
  button: {
    position: "relative",
    top: 350,
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
