import { WeatherData, WeatherType } from "./WeatherData";
import { Image, View } from "react-native";

export function WeatherIcon({ weather }: { weather: WeatherType }) {
  var icon = weather.weather[0].icon;
  var iconurl = "http://openweathermap.org/img/wn/" + icon + ".png";
  return (
    <View
      style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden', 
        elevation: 7, 
        shadowColor: 'white', 
      }}
    >
      <Image
        source={{ uri: iconurl }}
        style={{ width: 50, height: 50 }}
      />
    </View>
  );
}
