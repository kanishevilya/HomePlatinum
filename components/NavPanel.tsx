import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Icon from "../components/Icon";

export default function NavPanel({
  navigation,
  currentItem,
}: {
  navigation: any;
  currentItem: string;
}) {
  return (
    <View style={styles.mainCont}>
      <View style={styles.container}>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Icon
            name="home"
            color={currentItem == "Home" ? "#23282C" : "#7b8d9c"}
            size={32}
          />
        </Pressable>
        <Pressable onPress={() => {}}>
          <Icon
            name="paint-brush"
            color={currentItem == "Themes" ? "#23282C" : "#7b8d9c"}
            size={32}
          />
        </Pressable>
        <Pressable onPress={() => navigation.navigate("EditUser")}>
          <Icon
            name="user"
            color={currentItem == "EditUser" ? "#23282C" : "#7b8d9c"}
            size={32}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainCont: {
    position: "absolute",
    alignSelf: "center",
    bottom: 20,
    zIndex: 1,
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: 326,
    height: 74,
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
