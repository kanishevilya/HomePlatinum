import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

export type Device = {
    id: string | number[];
    name: string;
    type: string;
    status: 'active' | 'inactive';
};

type DevicesContextType = {
    devices: Device[];
    addDevice: (device: Device) => Promise<void>;
};

const DevicesContext = createContext<DevicesContextType>({} as DevicesContextType);

const initialDevices: Device[] = [
    {
        id: uuid.v4(),
        name: 'Smart Bulb',
        type: 'Lighting',
        status: 'active',
    },
    {
        id: uuid.v4(),
        name: 'Smart Thermostat',
        type: 'Climate Control',
        status: 'active',
    },
    {
        id: uuid.v4(),
        name: 'Security Camera',
        type: 'Security',
        status: 'inactive',
    },
];

export function DevicesProvider({ children }: { children: ReactNode }) {
    const [devices, setDevices] = useState<Device[]>([]);

    useEffect(() => {
        const loadDevices = async () => {
            setDevices(initialDevices);
        };
        loadDevices();
    }, []);

    const addDevice = async (device: Device) => {
        setDevices((prevDevices) => [...prevDevices, device]);
    };

    return (
        <DevicesContext.Provider value={{ devices, addDevice }}>
            {children}
        </DevicesContext.Provider>
    );
}

export function useDevices() {
    const context = useContext(DevicesContext);
    if (!context) {
        throw new Error('useDevices must be used within a DevicesProvider');
    }
    return context;
}
