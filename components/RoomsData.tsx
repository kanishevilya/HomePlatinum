import uuid from "react-native-uuid";

export type Device = {
  id: string | number[];
  name: string;
  type: string;
  status: boolean;
  lastUpdated: Date;
  properties: Record<string, any>;
  connectionType: string;
};
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

const RoomCategories: Record<string, string[]> = {
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

export const SectionNamesMock = [
  "Living Room",
  "Kitchen",
  "Study Room",
  "Restrooms",
];

export function AddSectionName(name: string){
  SectionNamesMock.push(name);
  RoomCategories[name]=[];
}

const RoomsMock: SectionOfRooms[] = [];
export function RoomsDataInit() {
  const roomMap = new Map<string, Room>();
  // console.log(SectionNamesMock);
  for (let section of SectionNamesMock) {
    const roomsArray: Room[] = RoomCategories[section].map(
      (roomName) => {
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
      }
    );

    RoomsMock.push({
      id: uuid.v4(),
      nameOfSection: section,
      roomsArray: roomsArray,
    });
  }
  console.log(RoomsMock);
}

export default function RoomsDataMock(){
    if(RoomsMock.length){
        return RoomsMock;
    }else{
        RoomsDataInit();
        return RoomsMock;
    }
}