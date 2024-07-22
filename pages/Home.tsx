import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";

import {
  Button,
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  WeatherDataLocation,
  WeatherData,
  WeatherType,
} from "../components/WeatherData";
import { WeatherIcon } from "../components/WeatherIcon";
import Icon from "../components/Icon";
import RoomsDataMock, {
  GeneralizationOfRooms,
  GeneralizationNamesMock,
  Room,
} from "../components/RoomsData";
import RoomCard from "../components/RoomCard";

const bedroomImage = require("../assets/images/Bedroom.png");

const { width } = Dimensions.get("window");

const getFormattedDate = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };
  return date.toLocaleDateString("en-US", options);
};

type RoomTextType = {
  index: number;
  name: string;
};

export default function Home({ navigation }: any) {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [currentRoomGeneralization, setCurrentRoom] = useState("");
  const [currentRoomsArray, setCurrentRoomsArray] = useState<Room[] | null>(
    null
  );
  const [currentFilteredRoomsArray, setCurrentFilteredRoomsArray] = useState<
    Room[]
  >([]);

  const [displayAddBlock, setDisplayAddBlock] = useState(true);

  const [nameFilter, setNameFilter] = useState("");

  const currentDay = getFormattedDate();
  // const [roomsDataWithoutFilters, setRoomsDataWithoutFilters]=useState<GeneralizationOfRooms[] | null>(null);
  const [roomsData, setRoomsData] = useState<GeneralizationOfRooms[] | null>(
    null
  );

  function switchDisplayAddBlock() {
    setDisplayAddBlock(!displayAddBlock);
  }

  useEffect(() => {
    const fetchWeather = async () => {
      let dataLoc = await WeatherDataLocation();
      if (!dataLoc.Error) {
        console.log(dataLoc);
        let _city = dataLoc[0].name;
        setCity(_city);
        let dataWeather = await WeatherData(_city);
        console.log(dataWeather);
        if (dataWeather) {
          setWeather(dataWeather);
        }
      }
    };
    fetchWeather();
    let mock = RoomsDataMock();
    setRoomsData(mock);
    // setRoomsDataWithoutFilters(mock);
    setCurrentRoom(mock[0].nameOfGeneralization);
    console.log(mock[0].nameOfGeneralization);
  }, []);
  useEffect(() => {
    let curRoomArr = null;
    if (roomsData) {
      let genData = roomsData.filter(
        (i) => i.nameOfGeneralization == currentRoomGeneralization
      );
      if (genData.length) {
        curRoomArr = genData[0].roomsArray;
      }
    }
    setCurrentRoomsArray(curRoomArr);
    // setCurrentFilteredRoomsArray(curRoomArr ?? []);
    // filterByName("");
    // if(!currentFilteredRoomsArray.length){
    //   setCurrentFilteredRoomsArray(curRoomArr?? []);
    // }
  }, [currentRoomGeneralization]);

  function filterByName(name: string, curRoomArr: [] = []) {
    if (curRoomArr.length) {
      setCurrentFilteredRoomsArray(curRoomArr);
    }
    if (!currentRoomsArray) {
      return;
    }
    if (!name.trim()) {
      setCurrentFilteredRoomsArray(currentRoomsArray);
      return;
    }
    const filteredArray = currentRoomsArray.filter((room) =>
      room.nameOfRoom.toLowerCase().includes(name.toLowerCase().trim())
    );
    setCurrentFilteredRoomsArray(filteredArray);
  }

  function RoomText({
    item,
  }: {
    item: { index: number; item: GeneralizationOfRooms };
  }) {
    function onClick() {
      if (currentRoomGeneralization == item.item.nameOfGeneralization) {
        return;
      }
      setCurrentRoom(item.item.nameOfGeneralization);
      switchList();
    }
    let s: any[] = [styles.roomItem];
    if (item.index == 0) {
      s.push({ paddingLeft: 32 });
    } else if (item.index == GeneralizationNamesMock.length - 1) {
      s.push({ paddingRight: 32 });
    }
    if (item.item.nameOfGeneralization == currentRoomGeneralization) {
      s.push({ opacity: 1 });
    }
    return (
      <Pressable onPress={onClick} style={{ paddingVertical: 20}}>
        <Text style={s}>{item.item.nameOfGeneralization}</Text>
      </Pressable>
    );
  }

  const flatListRef = useRef<FlatList<any>>(null);
  const scrollY = useRef(0);

  const handleScroll = (event: any) => {
    scrollY.current = event.nativeEvent.contentOffset.y;
  };

  const switchList = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: scrollY.current,
        animated: false,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "#F1F1F1" }]}>
      <LinearGradient
        style={styles.topView}
        colors={["rgb(230,230,230)", "white"]}
      >
        <View style={styles.headerView}>
          {weather ? (
            <LinearGradient
              style={styles.weatherIconBlock}
              colors={["#68bce3", "#81D4FA", "#bae9ff"]}
              // colors={["rgba(104, 188, 227, 1)", "rgba(104, 188, 227, 0.5)", "rgba(104, 188, 227, 0)"]}
            >
              <WeatherIcon weather={weather} />
              <View style={styles.textContainer}>
                <Text style={styles.currentDate}>{currentDay}</Text>
                <Text style={styles.weatherInfoText}>
                  {weather.weather[0].main}
                </Text>
              </View>
            </LinearGradient>
          ) : (
            <Text>Загрузка Данных</Text>
          )}
          <View style={styles.notificationsBtn}>
            <Icon name="ellipsis-h" color="white" size={35} />
          </View>
        </View>
        <View style={styles.generalInfoView}>
          <Text style={styles.infoTitle}>General Information</Text>
          <View style={styles.row}>
            <View style={styles.infoBlock}>
              <Text style={styles.blockTitle}>{weather?.main.temp} °C</Text>
              <Text style={styles.blockSubTitle}>Outdoor Temp</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.blockTitle}>
                {weather?.main.feels_like} °C
              </Text>
              <Text style={styles.blockSubTitle}>Feels like</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.blockTitle}>{weather?.wind.speed} m/s</Text>
              <Text style={styles.blockSubTitle}>Wind Speed</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      {/* <View style={{ flexDirection: "row" }}>
        <TextInput
          style={styles.input}
          value={nameFilter}
          onChangeText={(n) => {
            setNameFilter(n);
            filterByName(n);
          }}
        />
        <Button title="Filter" onPress={() => filterByName(nameFilter)} />
      </View> */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.sideMenu}>
          {displayAddBlock && (
            <View style={styles.hiddenMenu}>
              <View style={styles.addGenView}>
                <View style={[styles.plusContainer, {marginBottom: -10}]}>
                  <Icon name="plus" color="#49545c" size={32} />
                </View>
              </View>
              <View style={styles.addRoomView}>
                <View style={[styles.plusContainer, { marginTop: -60, paddingVertical: 110 }]}>
                  <Icon
                    name="plus"
                    color="#49545c"
                    size={50}
                  />
                </View>
              </View>
            </View>
          )}
          <Pressable onPress={switchDisplayAddBlock}>
            <View style={styles.dropDownSideMenu}>
              <Icon
                name={displayAddBlock ? "angle-left" : "angle-right"}
                size={32}
                color="#49545c"
              />
            </View>
          </Pressable>
        </View>

        <View
          style={
            displayAddBlock
              ? [styles.mainView, { paddingLeft: 115 }]
              : styles.mainView
          }
        >
          {roomsData && (
            <FlatList
              style={{marginTop: 10, borderTopWidth: 2, borderBottomWidth: 2, borderColor: "rgba(35, 40, 44, 0.3)",}}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={roomsData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={(item) => <RoomText item={item} />}
            />
          )}
          {roomsData &&
            (currentFilteredRoomsArray.length > 0 || currentRoomsArray) && (
              <FlatList
                style={styles.roomsList}
                showsHorizontalScrollIndicator={false}
                ref={flatListRef}
                onScroll={handleScroll}
                horizontal={true}
                data={currentRoomsArray}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(item) => (
                  <RoomCard
                    item={item}
                    currentRoomsArray={currentRoomsArray}
                    bedroomImage={bedroomImage}
                  />
                )}
              />
            )}
        </View>
      </View>
      <Button
        title="Colors"
        onPress={() => {
          navigation.navigate("ColorPalette");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  plusContainer:{
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    shadowColor: "black",
    elevation: 3,
  },
  hiddenMenu: {
    flex: 1,
    width: 100,
    backgroundColor: "#49545c",
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: 'white'
  },
  sideMenu: {
    flexDirection: "row",
    position: "absolute",
    top: 15,
    // height: 445,
    zIndex: 2,

    shadowColor: "black",
    elevation: 10,

    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  dropDownSideMenu: {
    height: 450,
    width: 25,
    backgroundColor: "white",
    zIndex: 2,
    // borderWidth:1,
    // borderLeftWidth: 0,
    // borderColor: "gray",
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  addGenView: {
    height: 70,
    // backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  addRoomView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  roomsList: {
    height: 400,
    // paddingHorizontal: 20,
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
  mainView: {
    // margin: 32,
    paddingLeft: 15,
    marginTop: 12,
    zIndex: 0,
  },
  roomItem: {
    fontWeight: "600",
    opacity: 0.3,
    fontSize: 16,
    paddingRight: 20,
    color: "#23282C",
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#23282C",
  },
  blockSubTitle: {
    opacity: 0.6,
    fontSize: 16,
    fontWeight: "500",
    color: "#23282C",
  },
  infoBlock: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  infoTitle: {
    fontWeight: "600",
    fontSize: 20,
    textAlign: "left",
  },
  generalInfoView: {
    marginTop: 24,
    // backgroundColor: "gray",
    width: 326,
    alignItems: "flex-start",
    // justifyContent: "flex-start",
  },
  notificationsBtn: {
    width: 48,
    height: 48,
    backgroundColor: "#23282C",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerView: {
    width: 330,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  currentDate: {
    opacity: 0.6,
    color: "#23282C",
    fontSize: 14,
    fontWeight: "600",
  },
  weatherInfoText: {
    opacity: 0.9,
    color: "#23282C",
    fontSize: 18,
    fontWeight: "700",
  },
  textContainer: {
    marginLeft: 10,
  },
  weatherIconBlock: {
    // width: 150,
    flexDirection: "row",
    // justifyContent: "flex-start",
    alignSelf: "flex-start",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: "#68bce3",

    // backgroundColor: "#b1c6cc",
    backgroundColor: "#81D4FA",
    paddingVertical: 5,
    paddingRight: 20,
    paddingLeft: 10,
    marginVertical: 5,

    shadowColor: "white",
    elevation: 6,
  },
  topView: {
    width: width,
    height: 240,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: "center",
    shadowColor: "gray",
    elevation: 20,
  },

  textView: {
    marginRight: 20,
    marginTop: 40,
  },
  blueText: {
    color: "#116092",
    fontWeight: "600",
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
    height: 40,
    width: 326,
    textAlign: "left",
    fontSize: 20,
    color: "#23282C",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 5,

    backgroundColor: "white",
    // backgroundColor: "linear-topView(180.00deg, rgb(237, 237, 237) -0.18, rgb(255, 255, 255) 1.1)",
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
    // gap: 10,
    // rowGap: 60,
    columnGap: 30,
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
    color: "#217EC9",
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
