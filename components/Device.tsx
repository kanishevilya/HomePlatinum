type Device = {
    id: number;
    name: string;
    type: string;
    status: 'active' | 'inactive';
};

const mockDevices: Device[] = [
    {
        id: 1,
        name: 'Smart Bulb',
        type: 'Lighting',
        status: 'active',
    },
    {
        id: 2,
        name: 'Smart Thermostat',
        type: 'Climate Control',
        status: 'active',
    },
    {
        id: 3,
        name: 'Security Camera',
        type: 'Security',
        status: 'inactive',
    },
    {
        id: 4,
        name: 'Smart Lock',
        type: 'Security',
        status: 'active',
    },
];