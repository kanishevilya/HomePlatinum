import { useTheme } from "../ThemeContext";

type ThemeType = 'blue' | 'pink' | 'dark';

interface Theme {
  colors: string[];
  borderColor: string;
  gradientColor: string;
  textColor?: string;
}


export const themeData: Record<ThemeType, Theme> = {
  blue: {
    colors: ["#68bce3", "#81D4FA", "#bae9ff"],
    borderColor: "#68bce3",
    gradientColor: "#A1DBFF",
  },
  pink: {
    colors: ["#ff77a9", "#ff9bbf", "#ffb3d9"],
    borderColor: "#ff77a9",
    gradientColor: "#ffb3d9",
  },
  dark: {
    colors: ["#333333", "#4f4f4f", "#6b6b6b"],
    borderColor: "#333333",
    gradientColor: "#666666",
    textColor: "#ffffff",
  }
};

export function getTheme(): Theme {
    const { theme } = useTheme();
  
    if (theme in themeData) {
      return themeData[theme as ThemeType];
    }
  
    return themeData.blue;
  }