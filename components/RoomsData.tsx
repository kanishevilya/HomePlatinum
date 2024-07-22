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
