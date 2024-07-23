import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { UsersProvider } from "./UsersContext";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ColorPalette from "./pages/ColorPalette";
import AddRoomSection from "./pages/AddRoomSection";
import { RoomsProvider } from "./RoomsContext";
import RemoveRoomSection from "./pages/RemoveRoomSection";
import AddRoom from "./pages/AddRoom";
const RootStack = createNativeStackNavigator();
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import RemoveRoom from "./pages/RemoveRoom";
import EditSection from "./pages/EditRoomSection";
import EditRoom from "./pages/EditRoom";

export default function App() {
  return (
    <UsersProvider>
      <RoomsProvider>
        <NavigationContainer>
          <StatusBar />
          <RootStack.Navigator>
            <RootStack.Group>
              <RootStack.Screen
                name="Home"
                component={Home}
                options={({ navigation, route }) => ({ headerShown: false })}
              />
              <RootStack.Screen
                name="Login"
                component={Login}
                options={({ navigation }) => ({ headerShown: false })}
              />
              <RootStack.Screen
                name="Register"
                component={Register}
                options={({ navigation }) => ({ headerShown: false })}
              />
            </RootStack.Group>
            <RootStack.Group screenOptions={{ presentation: "modal" }}>
              <RootStack.Screen
                name="ColorPalette"
                component={ColorPalette}
                options={({ navigation }) => ({ headerShown: false })}
              />
              <RootStack.Screen
                name="AddRoomSection"
                component={AddRoomSection}
                options={({ navigation, route }) => ({ headerShown: false })}
              />
              <RootStack.Screen
                name="EditRoomSection"
                component={EditSection}
                options={({ navigation, route }) => ({ headerShown: false })}
              />
              <RootStack.Screen
                name="EditRoom"
                component={EditRoom}
                options={({ navigation, route }) => ({ headerShown: false })}
              />
              <RootStack.Screen
                name="AddRoom"
                component={AddRoom}
                options={({ navigation, route }) => ({ headerShown: false })}
              />
              <RootStack.Screen
                name="RemoveRoom"
                component={RemoveRoom}
                options={({ navigation, route }) => ({ headerShown: false })}
              />
              <RootStack.Screen
                name="RemoveRoomSection"
                component={RemoveRoomSection}
                options={({ navigation, route }) => ({ headerShown: false })}
              />
            </RootStack.Group>
          </RootStack.Navigator>
        </NavigationContainer>
      </RoomsProvider>
    </UsersProvider>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    borderRadius: 7,
    backgroundColor: "cadetblue",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  btnText: {
    userSelect: "none",
    fontSize: 18,
    color: "white",
  },
});
