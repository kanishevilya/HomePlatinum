import { useState } from "react";
import { View, StyleSheet, TextInput, Pressable, Text } from "react-native";

export default function AddRoomGeneralization() {
  const [nameOfGen, setNameOfGen] = useState("");
  return (
    <View style={styles.container}>
      <TextInput
        value={nameOfGen}
        onChangeText={setNameOfGen}
        placeholder="Enter a Room Generalization"
        placeholderTextColor="gray"
      />
      <Pressable style={styles.btn}>
        <Text style={styles.btnText}>Add</Text>
      </Pressable>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
  },
  textView: {
    marginRight: 20,
    marginTop: 40,
  },
  blueText: {
    color: "#3A96CF",
    fontWeight: "700",
  },
  mainTitle: {
    color: "#23282C",
    // fontFamily: "Poppins",
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: 4,
    textAlign: "left",
  },
  title: {
    color: "#435563",
    fontSize: 36,
    fontWeight: "500",
    textAlign: "left",
    paddingTop: 10,
    paddingLeft: 3,
  },
  subTitle: {
    opacity: 0.3,
    color: "#23282C",
    fontSize: 24,
    fontWeight: "400",
    paddingTop: 4,
    paddingLeft: 3,
  },
  loginText: {
    width: 195,
    textAlign: "center",
    fontSize: 50,
    fontWeight: "500",
    color: "#435563",
  },
  loginBlock: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
  },
  firstInput: {
    marginBottom: 30,
  },
  input: {
    height: 64,
    width: 326,
    textAlign: "left",
    fontSize: 20,
    color: "#23282C",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 12,

    backgroundColor: "white",
    // backgroundColor: "linear-gradient(180.00deg, rgb(237, 237, 237) -0.18, rgb(255, 255, 255) 1.1)",
    paddingHorizontal: 20,

    shadowColor: "#23282C",
    elevation: 10,
  },
  iconView: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  text: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "800",
    padding: 10,
    color: "cadetblue",
  },
  btn: {
    width: 326,
    height: 64,
    marginTop: 50,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(111, 111, 111, 0.9)",
    backgroundColor: "#23282C",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    userSelect: "none",
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
  grayText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgb(35, 40, 44)",
    opacity: 0.4,
  },
  underBtnLink: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3A96CF",
  },
  biometricBtn: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    width: 147,
    height: 62,
    borderRadius: 24,
    backgroundColor: "white",

    shadowColor: "#23282C",
    elevation: 8,
  },
  biometricBtnText: {
    fontWeight: "500",
    fontSize: 14,
    color: "#23282C",
  },
});
