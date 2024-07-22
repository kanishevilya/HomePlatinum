import * as Location from "expo-location";

export default async function LocationData():Promise<Location.LocationObject | null>{
    let {status} = await Location.requestForegroundPermissionsAsync();
    if(status!=="granted"){
        return null;
    }   
    let locObj=await Location.getCurrentPositionAsync();
    return locObj;
}