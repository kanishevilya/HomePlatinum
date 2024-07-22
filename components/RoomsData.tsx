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
  namesOfGeneralization: string[]; // Например, у нас есть комната "Детская", она может относиться к разделам LivingRoom и Study Room одновременно
  nameOfRoom: string;
  image: string;
  devices: Device[];
};

export type GeneralizationOfRooms = {
  id: string | number[];
  nameOfGeneralization: string;
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

export const GeneralizationNamesMock = [
  "Living Room",
  "Kitchen",
  "Study Room",
  "Restrooms",
];

const RoomsMock: GeneralizationOfRooms[] = [];
export function RoomsDataInit() {
  const roomMap = new Map<string, Room>();

  for (let generalization of GeneralizationNamesMock) {
    const roomsArray: Room[] = RoomCategories[generalization].map(
      (roomName) => {
        if (roomMap.has(roomName)) {
          const existingRoom = roomMap.get(roomName)!;
          existingRoom.namesOfGeneralization.push(generalization);
          return existingRoom;
        } else {
          const newRoom: Room = {
            id: uuid.v4(),
            namesOfGeneralization: [generalization],
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
      nameOfGeneralization: generalization,
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