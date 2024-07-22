import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

export type Room = {
  id: string | number[];
  namesOfSection: string[]; // Например, у нас есть комната "Детская", она может относиться к разделам LivingRoom и Study Room одновременно
  nameOfRoom: string;
  image: string;
  devices: Device[];
};

export type SectionOfRooms = {
  id: string | number[];
  nameOfSection: string;
  roomsArray: Room[];
};

const RoomsInSection: Record<string, string[]> = {
  "Living Room": [
    "Media Room",
    "Home Theater",
    "Reading Nook",
    "Game Room",
    "Music Room",
    "Home Gym",
    "Workout Room",
    "Playroom",
  ],
  Kitchen: ["Wine Cellar", "Utility Room"],
  "Study Room": [
    "Home Office",
    "Study Room",
    "Reading Nook",
    "Workshop",
    "Studio",
    "Craft Room",
    "Sewing Room",
    "Meditation Room",
  ],
  Restrooms: ["Restroom", "Laundry"],
};

export const SectionNames = [
  "Living Room",
  "Kitchen",
  "Study Room",
  "Restrooms",
];

// export function AddSectionName(name: string) {
//   SectionNames.push(name);
//   RoomsInSection[name] = [];
// }

// const RoomsMock: SectionOfRooms[] = [];

// export function RoomsDataInit() {
//   const roomMap = new Map<string, Room>();
//   // console.log(SectionNames);
//   for (let section of SectionNames) {
//     const roomsArray: Room[] = RoomsInSection[section].map((roomName) => {
//       if (roomMap.has(roomName)) {
//         const existingRoom = roomMap.get(roomName)!;
//         existingRoom.namesOfSection.push(section);
//         return existingRoom;
//       } else {
//         const newRoom: Room = {
//           id: uuid.v4(),
//           namesOfSection: [section],
//           nameOfRoom: roomName,
//           image: "",
//           devices: [],
//         };
//         roomMap.set(roomName, newRoom);
//         return newRoom;
//       }
//     });

//     RoomsMock.push({
//       id: uuid.v4(),
//       nameOfSection: section,
//       roomsArray: roomsArray,
//     });
//   }
//   console.log(RoomsMock);
// }

// export default function RoomsDataMock() {
//   if (RoomsMock.length) {
//     return RoomsMock;
//   } else {
//     RoomsDataInit();
//     return RoomsMock;
//   }
// }

type RoomsContextType = {
  rooms: SectionOfRooms[];
  sectionNames: string[];
  roomsInSection: Record<string, string[]>;
  GetRoomsData: () => SectionOfRooms[];
  RoomsDataInit: (_sectionNames: string[]) => void;
  AddSectionName: (name: string) => void;
};

const RoomsContext = createContext<RoomsContextType>({} as RoomsContextType);

export function RoomsProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<SectionOfRooms[]>([]);
  const [sectionNames, setSectionNames] = useState<string[]>([]);
  const [roomsInSection, setRoomsInSection] = useState<
    Record<string, string[]>
  >({ "": [] });

  useEffect(() => {
    const loadRooms = async () => {
      let savedRooms = (await AsyncStorage.getItem("rooms")) as string;
      if (savedRooms) {
        let parsedRooms = JSON.parse(savedRooms);
        setRooms(parsedRooms);
      } else {
        setRooms([]);
      }
    };
    const loadSections = async () => {
      let savedSections = (await AsyncStorage.getItem("sections")) as string;
      if (savedSections) {
        let parsedSections = JSON.parse(savedSections);
        setSectionNames(parsedSections);
      } else {
        setSectionNames(SectionNames);
      }
    };
    const loadRoomsInSection = async () => {
      let savedRoomsInSections = (await AsyncStorage.getItem(
        "roomsInSection"
      )) as string;
      if (savedRoomsInSections) {
        let parsedRoomsInSections = JSON.parse(savedRoomsInSections);
        setRoomsInSection(parsedRoomsInSections);
      } else {
        setRoomsInSection(RoomsInSection);
      }
    };
    loadRooms();
    loadSections();
    loadRoomsInSection();
  }, []);

  useEffect(() => {
    const saveRooms = async () => {
      await AsyncStorage.setItem("rooms", JSON.stringify(rooms));
    };
    saveRooms();
  }, [rooms]);

  useEffect(() => {
    // console.log("BBB");
    const saveSectionNames = async () => {
      await AsyncStorage.setItem("sections", JSON.stringify(sectionNames));
    };
    saveSectionNames();
  }, [sectionNames]);

  useEffect(() => {
    console.log("CCC");
    console.log(roomsInSection);
    const saveRoomsInSection = async () => {
      await AsyncStorage.setItem(
        "roomsInSection",
        JSON.stringify(roomsInSection)
      );
    };
    saveRoomsInSection();
  }, [roomsInSection]);

  function RoomsDataInit(_sectionNames: string[] = sectionNames) {
    const roomMap = new Map<string, Room>();
    // console.log(SectionNames);
    const _rooms: SectionOfRooms[] = [];
    console.log(_sectionNames);
    for (let section of _sectionNames) {
      console.log(section);
      const roomsArray: Room[] = roomsInSection[section]?.map((roomName) => {
        if (roomMap.has(roomName)) {
          const existingRoom = roomMap.get(roomName)!;
          existingRoom.namesOfSection.push(section);
          return existingRoom;
        } else {
          const newRoom: Room = {
            id: uuid.v4(),
            namesOfSection: [section],
            nameOfRoom: roomName,
            image: "",
            devices: [],
          };
          roomMap.set(roomName, newRoom);
          return newRoom;
        }
      }) ?? [];
      console.log(roomsArray);
      _rooms.push({
        id: uuid.v4(),
        nameOfSection: section,
        roomsArray: roomsArray,
      });
    }

    setRooms(_rooms);
    return _rooms;
  }

  function GetRoomsData() {
    if (rooms.length) {
      return rooms;
    } else {
      return RoomsDataInit();
    }
  }

  function AddSectionName(name: string) {
    if (!sectionNames.includes(name)) {
      let _sectionNames = [...sectionNames, name];
      setSectionNames(_sectionNames);
      setRoomsInSection((prev) => ({ ...prev, [name]: [] }));
      RoomsDataInit(_sectionNames);
    }
  }

  return (
    <RoomsContext.Provider
      value={{
        rooms,
        sectionNames,
        roomsInSection,
        GetRoomsData,
        RoomsDataInit,
        AddSectionName,
      }}
    >
      {children}
    </RoomsContext.Provider>
  );
}

export function useRooms() {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error("useRooms must be used within a RoomsProvider");
  }
  return context;
}
