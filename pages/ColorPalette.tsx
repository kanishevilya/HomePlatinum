import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

export default function ColorPalette (){
  const [color, setColor] = useState('');

  const onColorChange = (color:string) => {
    setColor(color);
  };
  return (
    <SafeAreaView>
      <View style={styles.sectionContainer}>
        <ColorPicker
          
          color={color}
          onColorChange={(color) => onColorChange(color)}
          // onColorChangeComplete={color => alert(`Color selected: ${color}`)}
          thumbSize={40}
          sliderSize={50}
          noSnap={true}
          row={false}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 70,
    paddingHorizontal: 24,
  },
});
 