import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import uuid from "react-native-uuid";

export type Task = {
  id: string | number[];
  time: string;
  devices: (string | number[])[];
};

type DeviceFunction =
  | "brightness"
  | "color"
  | "humidity"
  | "temperature"
  | "backlight"
  | "timer";

export interface Device {
  id: string | number[];
  name: string;
  functions: DeviceFunction[];
  state: {
    isOn: boolean;
    brightness?: number;
    color?: string;
    humidity?: number;
    temperature?: number;
    backlight?: boolean;
    timer?: number;
  };
  timerSettings?: {
    onTime?: number;
    offTime?: number;
  };
  roomId: string | number[] | null;
}

interface DevicesContextType {
  devices: Device[];
  tasks: Task[];
  addDevice: (
    name: string,
    functions: DeviceFunction[],
    roomId: string | number[] | null
  ) => string | number[];
  updateDeviceState: (
    id: string | number[],
    state: Partial<Device["state"]>
  ) => void;
  setTimer: (
    id: string | number[],
    timerSettings: Device["timerSettings"]
  ) => void;
  addTask: (time: string, deviceIds: (string | number[])[]) => void;
  handleTasks: () => void;
  handleTimers: () => void;
  getDevicesInRoom: (roomId: string) => Device[];
}

const DevicesContext = createContext<DevicesContextType | undefined>(undefined);

export function DevicesProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const savedDevices = (await AsyncStorage.getItem("devices")) as string;
      const savedTasks = (await AsyncStorage.getItem("tasks")) as string;
      let parsedDevices = JSON.parse(savedDevices);
      let parsedTasks = JSON.parse(savedTasks);
      if (parsedDevices) {
        setDevices(parsedDevices);
      }
      if (parsedTasks) {
        setTasks(parsedTasks);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveDevices = async () => {
      await AsyncStorage.setItem("devices", JSON.stringify(devices));
    };
    saveDevices();
  }, [devices]);

  useEffect(() => {
    const saveTasks = async () => {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    };
    saveTasks();
  }, [tasks]);

  const addDevice = (
    name: string,
    functions: DeviceFunction[],
    roomId: string | number[] | null
  ) => {
    const id=uuid.v4();
    setDevices((prevDevices) => [
      ...prevDevices,
      {
        id:id ,
        name,
        functions,
        state: {
          isOn: false,
        },
        roomId: roomId,
      },
    ]);
    return id;
  };

  const updateDeviceState = (
    id: string | number[],
    state: Partial<Device["state"]>
  ) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === id
          ? { ...device, state: { ...device.state, ...state } }
          : device
      )
    );
  };

  const setTimer = (
    id: string | number[],
    timerSettings: Device["timerSettings"]
  ) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === id ? { ...device, timerSettings } : device
      )
    );
  };

  const addTask = (time: string, deviceIds: (string | number[])[]) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        id: uuid.v4(),
        time,
        devices: deviceIds,
      },
    ]);
  };

  const handleTasks = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    tasks.forEach((task) => {
      if (task.time === currentTime) {
        task.devices.forEach((deviceId) => {
          const device = devices.find((d) => d.id === deviceId);
          if (device) {
            updateDeviceState(deviceId, { isOn: true });
          }
        });
      }
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleTasks();
      handleTimers();
    }, 60000);
    return () => clearInterval(intervalId);
  }, [devices, tasks]);

  const handleTimers = () => {
    const now = new Date();
    devices.forEach((device) => {
      const { timerSettings, state } = device;
      if (timerSettings) {
        const { onTime, offTime } = timerSettings;
        const minutesPassed =
          now.getHours() * 60 + now.getMinutes() - (device.state.timer || 0);

        if (onTime && minutesPassed >= onTime) {
          updateDeviceState(device.id, { isOn: true });
        }
        if (offTime && minutesPassed >= offTime) {
          updateDeviceState(device.id, { isOn: false });
        }
      }
    });
  };
  const getDevicesInRoom = (roomId: string) => {
    return devices.filter((device) => device.roomId === roomId);
  };
  return (
    <DevicesContext.Provider
      value={{
        getDevicesInRoom,
        tasks,
        addTask,
        handleTasks,
        devices,
        addDevice,
        updateDeviceState,
        setTimer,
        handleTimers,
      }}
    >
      {children}
    </DevicesContext.Provider>
  );
}

export function useDevices() {
  const context = useContext(DevicesContext);
  if (!context) {
    throw new Error("useDevices must be used within a DevicesProvider");
  }
  return context;
}
