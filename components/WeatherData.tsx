import LocationData from "./LocationData";

export type WeatherType = {
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string | null;
  }[];
  Error? :string;
};

export async function WeatherData(
  city: string
){
  try {
    const api = "313dfe04dab65bf2a2d46ad316a64e21";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      console.log("Error loading");
      return null;
    }
    const data = await response.json();
    console.info(data);
    return data as WeatherType;
  } catch (error) {
    console.error("Error loading: ", error);
    return null;
  }
}

export async function WeatherDataLocation() {
  let locData = await LocationData();
  let lat = null;
  let lon = null;
  if (locData) {
    lat = locData.coords.latitude;
    lon = locData.coords.longitude;
  }
  try {
    const limit = 1;
    const api = "313dfe04dab65bf2a2d46ad316a64e21";
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${api}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      console.log("Error loading");
      return null;
    }
    const data = await response.json();
    console.info(data);
    return data;
  } catch (ex) {
    console.error("Ошибка при загрузки API: ", ex);
    return null;
  }
  return null;
}
