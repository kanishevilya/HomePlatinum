import React from "react";
import { View, Button, StyleSheet, Pressable, Text } from "react-native";
import { useTheme } from "../ThemeContext";
import Icon from "../components/Icon";

export default function Themes({ navigation }: any) {
  const { toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.goBackContainer}
      >
        <Icon name="arrow-circle-left" color="#23282C" size={42} />
        <Text style={styles.goBackText}>Go Back</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={() => {toggleTheme("dark"); navigation.goBack();}}>
        <Text style={[styles.btnText, {color: "white"}]}>Dark theme</Text>
      </Pressable>
      <Pressable
        style={[styles.btn, { backgroundColor: "#68bce3" }]}
        onPress={() => {toggleTheme("blue"); navigation.goBack();}}
      >
        <Text style={styles.btnText}>Blue theme</Text>
      </Pressable>
      <Pressable
        style={[styles.btn, { backgroundColor: "pink" }]}
        onPress={() =>{toggleTheme("pink"); navigation.goBack();}}
      >
        <Text style={styles.btnText}>Pink theme</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 5,
    backgroundColor: "#23282C",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#23282C",
  },
});
