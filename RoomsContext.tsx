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
  addRoomToSection: (
    sectionId: string | number[],
    roomId: string | number[]
  ) => void;
  addRoom: (room: Room) => void;
  removeRoom: (id: string | number[]) => void;
  getSections: () => Section[];
  getRooms: () => Room[];
  removeSection: (id: string | number[]) => void;
  removeRoomFromSection: (
    roomId: string | number[],
    sectionId: string | number[]
  ) => void;
  getUnassignedRooms: () => Room[];
  updateSection: (
    sectionId: string | number[],
    updatedSection: Partial<Section>
  ) => void;
  updateRoom: (
    roomId: string | number[],
    updatedRoom: Partial<Room>
  ) =>void;
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
      const newId = uuid.v4();
      const newSection = { id: newId, name, roomIds: [] } as Section;
      setSections((prevSections) => [...prevSections, newSection]);
      return newId;
    }
    return null;
  };

  const removeSection = (id: string | number[]) => {
    setSections((prevSections) =>
      prevSections.filter((section) => section.id !== id)
    );

    setRooms((prevRooms) =>
      prevRooms.map((room) => ({
        ...room,
        sectionIds: room.sectionIds.filter((sectionId) => sectionId !== id),
      }))
    );
  };

  const removeRoomFromSection = (
    roomId: string | number[],
    sectionId: string | number[]
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              roomIds: section.roomIds.filter((id) => id !== roomId),
            }
          : section
      )
    );

    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              sectionIds: room.sectionIds.filter((id) => id !== sectionId),
            }
          : room
      )
    );
  };

  const addRoomToSection = (
    sectionId: string | number[],
    roomId: string | number[]
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? { ...section, roomIds: [...section.roomIds, roomId] }
          : section
      )
    );

    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId
          ? { ...room, sectionIds: [...room.sectionIds, sectionId] }
          : room
      )
    );
  };
  const addRoom = (room: Room) => {
    setRooms((prevRooms) => [...prevRooms, room]);

    setSections((prevSections) =>
      prevSections.map((section) =>
        room.sectionIds.includes(section.id)
          ? { ...section, roomIds: [...section.roomIds, room.id] }
          : section
      )
    );
  };

  const removeRoom = (roomId: string | number[]) => {
    setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));

    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        roomIds: section.roomIds.filter((id) => id !== roomId),
      }))
    );
  };

  const getUnassignedRooms = () => {
    return rooms.filter((room) => room.sectionIds.length == 0);
  };

  // Partial такая штука, которая представляет собой 'разбитый' объект, то есть
  // { ...section, ...updatedSection } говорит, что мы не трогаем элементы section
  // кроме тех, которые находятся в updtSection
  const updateSection = (
    sectionId: string | number[],
    updatedSection: Partial<Section>
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, ...updatedSection } : section
      )
    );
  };

  const updateRoom = (
    roomId: string | number[],
    updatedRoom: Partial<Room>
  ) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, ...updatedRoom } : room
      )
    );
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
        addRoom,
        removeRoom,
        getSections,
        getRooms,
        removeSection,
        removeRoomFromSection,
        getUnassignedRooms,
        updateSection,
        updateRoom
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
