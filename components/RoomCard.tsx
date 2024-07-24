import React, { useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  Animated,
  PanResponder,
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
  PanResponderGestureState,
  GestureResponderEvent,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import Icon from "./Icon";

import EditIcon from "../assets/images/EditIcon.svg";
import LockIcon from "../assets/images/LockIcon.svg";
import {getDefImg, Room } from "../RoomsContext";
import { getTheme } from "./ThemesData";


function RoomCardWithoutAnimation({
  item,
  currentRoomsArray,
  image,
  panResponder,
  styleAdditional,
  navigation,
}: {
  item: { index: number; item: Room };
  currentRoomsArray: Room[] | null;
  image: any;
  panResponder: any;
  styleAdditional: any | null;
  navigation: any;
}) {
  // let s: any[] = [styles.roomCard];
  // if (styleAdditional) {
  //   s.push(styleAdditional);
  // }
  // if (item.index === 0) {
  //   s.push({ marginLeft: 32 });
  // } else if (item.index === (currentRoomsArray?.length ?? 0) - 1) {
  //   s.push({ marginRight: 32 });
  // }
  const theme=getTheme();

  return (
    <Pressable onPress={() => navigation.navigate("RoomDevices", {"roomId": item.item.id})}>
      <LinearGradient
        style={styles.roomCard}
        start={[0, 0]}
        end={[0.6, 0.5]}
        colors={[theme.gradientColor, "white"]}
      >
        <View style={styles.gestureZone} {...panResponder.panHandlers} />
        <ImageBackground
          style={styles.roomImage}
          imageStyle={{ borderRadius: 16 }}
          source={image.trim() ? {uri: image} : getDefImg() }
        >
          <LinearGradient
            style={styles.imageShadow}
            colors={["rgba(255,255,255, 0.4)", "rgba(0,0,0, 0.7)"]}
          />
        </ImageBackground>
        <Text style={styles.roomTitle}>{item.item.name}</Text>
        <Text style={styles.roomDevices}>
          {item.item.devices.length} Devices
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

export default function RoomCard({
  item,
  currentRoomsArray,
  image,
  navigation,
}: {
  item: { index: number; item: Room };
  currentRoomsArray: Room[] | null;
  image: any;
  navigation: any;
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const maxOffset = 80;
  const threshold = 70;
  // console.log(item.item);
  // console.log(currentRoomsArray);

  const handlePanResponderRelease = useCallback(
    (evn: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      if (gestureState.dy > threshold) {
        // console.log("Navigating to EditRoom with id:", item.item.id);
        navigation.navigate("EditRoom", { roomId: item.item.id });
      }
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
    [pan, threshold, navigation, item.item.id]
  );

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          Math.abs(gestureState.dx) < 30
        );
      },
      onPanResponderMove: (evt, gestureState) => {
        const newY = Math.max(0, Math.min(gestureState.dy, maxOffset));
        pan.setValue({ x: 0, y: newY });
      },
      onPanResponderRelease: handlePanResponderRelease,
      onPanResponderTerminate: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    });
  }, [handlePanResponderRelease, pan, maxOffset]);
  let s: any[] = [];
  let styleAdditional = null;
  if (item.index === 0) {
    styleAdditional = { marginLeft: 20 };
  } else if (item.index === (currentRoomsArray?.length ?? 0) - 1) {
    styleAdditional = { marginRight: 20 };
  }
  if (styleAdditional) {
    s.push(styleAdditional);
  }

  return (
    <View style={[styles.container, s]}>
      <View style={styles.editView}>
        {/* <Icon name="edit" color="#23282C" size={55} /> */}
        <EditIcon style={{ marginLeft: -10 }} />
        <Text style={styles.editText}>EDIT</Text>
      </View>

      <Animated.View
        style={{
          transform: pan.getTranslateTransform(),
          height: 200,
          justifyContent: "center",
          alignItems: "center",
          marginTop: -110,
          zIndex: 1,
        }}
        // {...panResponder.panHandlers}
      >
        {/* <Text>{item.item.image.substring(0, 40)}</Text> */}
        <RoomCardWithoutAnimation
          item={item}
          currentRoomsArray={currentRoomsArray}
          image={image}
          panResponder={panResponder}
          styleAdditional={styleAdditional}
          navigation={navigation}
        />
      </Animated.View>
      {/* <View style={styles.gestureZone} {...panResponder.panHandlers} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
  },
  editText: {
    fontSize: 40,
    fontWeight: "300",
  },
  editView: {
    flexDirection: "row",
    height: 200,
    width: 240,
    justifyContent: "center",
    zIndex: 0,
    paddingTop: 20,
    // backgroundColor: "blue",
  },
  roomCard: {
    marginTop: 6,
    marginBottom: 22,
    marginHorizontal: 12,
    width: 240,
    height: 340,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "white",
    shadowColor: "black",
    elevation: 10,
    alignItems: "center",
  },
  roomTitle: {
    fontWeight: "600",
    fontSize: 24,
    paddingTop: 8,
    width: 208,
    textAlign: "left",
    color: "#23282C",
  },
  roomDevices: {
    fontSize: 18,
    opacity: 0.3,
    width: 208,
    textAlign: "left",
    color: "#23282C",
    paddingTop: 8,
    fontWeight: "400",
  },
  imageShadow: {
    flex: 1,
    borderRadius: 16,
  },
  roomImage: {
    width: 208,
    height: 235,
    marginTop: 14,
  },
  gestureZone: {
    // marginTop: -280,
    position: "absolute",
    top: -5,
    height: 60,
    width: 240,
    // backgroundColor: "pink",
    zIndex: 2,
  },
});
