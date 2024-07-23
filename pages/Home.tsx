import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  WeatherDataLocation,
  WeatherData,
  WeatherType,
} from "../components/WeatherData";
import { WeatherIcon } from "../components/WeatherIcon";
import Icon from "../components/Icon";
import { Room, Section, useRooms } from "../RoomsContext";
import RoomCard from "../components/RoomCard";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function Home({ navigation, route }: any) {
  const { sections, rooms } = useRooms();

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [currentSectionId, setCurrentSectionId] = useState<string | number[] | null>(null);
  const [currentRoomsArray, setCurrentRoomsArray] = useState<Room[]>([]);
  const [displayAddBlock, setDisplayAddBlock] = useState(false);


  const currentDay = getFormattedDate();

  function switchDisplayAddBlock() {
    setDisplayAddBlock(!displayAddBlock);
  }
  console.log(route);

  useEffect(()=>{
    console.log(route);
    if(route.params && route.params.id){
      console.log("Ura?");
      setCurrentSectionId(route.params.id);
    }
  },[]);

  useFocusEffect(
    useCallback(() => {
      if(route.params && route.params.id){
        setCurrentSectionId(route.params.id);
      }
    }, [route.params])
  );
  useFocusEffect(
    useCallback(() => {
      console.log(route);
      const fetchWeather = async () => {
        let dataLoc = await WeatherDataLocation();
        if (!dataLoc.Error) {
          let _city = dataLoc[0].name;
          setCity(_city);
          let dataWeather = await WeatherData(_city);
          if (dataWeather) {
            setWeather(dataWeather);
          }
        }
      };
      fetchWeather();
      // alert(sections);
      console.log(sections);
      if (sections.length && !currentSectionId) {
        setCurrentSectionId(sections[0].id);
      }
      
    }, [])
  );

  useEffect(() => {
    console.log(currentSectionId);
    if (currentSectionId) {
      const section = sections.find((sec) => sec.id === currentSectionId);
      console.log(section);
      if (section) {
        const filteredRooms = rooms.filter((room) =>
          room.sectionIds.includes(currentSectionId)
        );
        setCurrentRoomsArray(filteredRooms);
      } else {
        setCurrentRoomsArray([]);
      }
    }
  }, [currentSectionId, sections, rooms]);

  function RoomText({ item }: { item: { index: number; item: Section } }) {
    function onClick() {
      if (currentSectionId === item.item.id) {
        return;
      }
      setCurrentSectionId(item.item.id.toString());
      switchList();
    }
    let style: any = [styles.roomItem];
    if (item.index === 0) {
      style.push({ paddingLeft: 32 });
    } else if (item.index === sections.length - 1) {
      style.push({ paddingRight: 32 });
    }
    if (item.item.id === currentSectionId) {
      style.push({ opacity: 1 });
    }
    return (
      <Pressable onPress={onClick} style={{ paddingVertical: 20 }}>
        <Text style={style}>{item.item.name}</Text>
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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.sideMenu}>
          {displayAddBlock && (
            <View style={styles.hiddenMenu}>
              <View style={styles.addGenView}>
                <Text style={styles.hiddenPanelText}>Sections</Text>
                <Pressable
                  onPress={() => {
                    switchDisplayAddBlock();
                    navigation.navigate("AddRoomSection");
                  }}
                >
                  <View style={[styles.plusContainer]}>
                    <Icon name="plus" color="white" size={32} />
                  </View>
                  <View style={[styles.plusContainer]}>
                    <Icon name="minus" color="white" size={32} />
                  </View>
                </Pressable>
              </View>
              <View style={styles.addRoomView}>
                <Text style={styles.hiddenPanelText}>Rooms</Text>
                <View style={[styles.plusContainer]}>
                  <Icon name="plus" color="white" size={32} />
                </View>
                <View style={[styles.plusContainer]}>
                  <Icon name="minus" color="white" size={32} />
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
          <FlatList
            style={{
              marginTop: 10,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "rgba(35, 40, 44, 0.3)",
            }}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={sections.length > 0 ? sections : []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item) => <RoomText item={item} />}
          />
          <FlatList
            style={styles.roomsList}
            showsHorizontalScrollIndicator={false}
            ref={flatListRef}
            onScroll={handleScroll}
            horizontal={true}
            data={currentRoomsArray.length > 0 ? currentRoomsArray : []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item) => (
              <RoomCard
                currentRoomsArray={currentRoomsArray}
                item={item}
                bedroomImage={bedroomImage}
              />
            )}
          />
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
  hiddenPanelText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    paddingBottom: 5,
  },
  plusContainer: {
    marginTop: 10,
    backgroundColor: "#758794",
    padding: 10,
    borderRadius: 10,
    shadowColor: "black",
    elevation: 3,
  },
  hiddenMenu: {
    flex: 1,
    width: 100,
    backgroundColor: "#49545c",
    gap: 10,
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
    height: 200,
    // flex: 1,
    // backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  addRoomView: {
    height: 200,
    // flex: 1,
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
