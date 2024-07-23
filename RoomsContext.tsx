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
  sectionIds: (string | number[])[];
  name: string;
  image: string;
  devices: Device[];
};

export type Section = {
  id: string | number[];
  name: string;
  roomIds: (string | number[])[];
};

const initialSections: Record<string, string[]> = {
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

export const sectionNames = Object.keys(initialSections);

type RoomsContextType = {
  sections: Section[];
  rooms: Room[];
  addSection: (name: string) => string | number[] | null;
  addRoomToSection: (sectionId: string, roomName: string) => void;
  getSections: () => Section[];
  getRooms: () => Room[];
};

const RoomsContext = createContext<RoomsContextType>({} as RoomsContextType);

export function RoomsProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const savedSections = await AsyncStorage.getItem("sections");
      const savedRooms = await AsyncStorage.getItem("rooms");

      if (savedSections) {
        setSections(JSON.parse(savedSections));
      } else {
        const sectionArray: Section[] = [];
        const roomArray: Room[] = [];

        sectionNames.forEach((name) => {
          const sectionId = uuid.v4();
          const roomIds = initialSections[name].map((roomName) => {
            const roomId = uuid.v4();
            roomArray.push({
              id: roomId,
              sectionIds: [sectionId],
              name: roomName,
              image: "",
              devices: [],
            });
            return roomId;
          });

          sectionArray.push({
            id: sectionId,
            name,
            roomIds,
          });
        });
        setSections(sectionArray);
        setRooms(roomArray);
      }
      if (savedRooms) {
        setRooms(JSON.parse(savedRooms));
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem("sections", JSON.stringify(sections));
      AsyncStorage.setItem("rooms", JSON.stringify(rooms));
    }
  }, [sections, rooms, isLoading]);

  const addSection = (name: string) => {
    if (!sections.some((section) => section.name === name)) {
      const newId=uuid.v4();
      const newSection = { id: newId, name, roomIds: [] } as Section;
      setSections((prevSections) => [...prevSections, newSection]);
      return newId;
    }
    return null;
  };

  const addRoomToSection = (sectionId: string, roomName: string) => {
    const section = sections.find((section) => section.id === sectionId);
    if (section && !rooms.some((room) => room.name === roomName)) {
      const newRoomId = uuid.v4();
      const newRoom: Room = {
        id: newRoomId,
        sectionIds: [sectionId],
        name: roomName,
        image: "",
        devices: [],
      };

      setRooms((prevRooms) => [...prevRooms, newRoom]);

      const updatedSections = sections.map((section) =>
        section.id === sectionId
          ? ({
              ...section,
              roomIds: [...section.roomIds, newRoomId],
            } as Section)
          : section
      );
      setSections(updatedSections);
    }
  };

  const getSections = () => sections;
  const getRooms = () => rooms;

  return (
    <RoomsContext.Provider
      value={{
        sections,
        rooms,
        addSection,
        addRoomToSection,
        getSections,
        getRooms,
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
