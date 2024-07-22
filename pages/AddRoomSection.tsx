import { useState } from "react";
import { View, StyleSheet, TextInput, Pressable, Text, Alert } from "react-native";
import Icon from "../components/Icon";
import { useNavigation } from "@react-navigation/native";
import { useRooms } from "../RoomsContext";

export default function AddRoomSection({navigation}:any) {
  // const navigation = useNavigation();
  const [nameOfSection, setNameOfSection] = useState("");
  const {sectionNames, AddSectionName} = useRooms();

  const handleAddPress = () => {
    const trimmedName = nameOfSection.trim();

    if (trimmedName == '') {
      Alert.alert('Error', 'Room Section name cannot be empty!');
      return;
    }

    const isDuplicate = sectionNames.some(
      (section) => section.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert('Error', 'Room Section with the same name already exists!');
      return;
    }
    AddSectionName(trimmedName);
    setNameOfSection('');
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.goBackContainer}>
        <Icon name="arrow-circle-left" color="#23282C" size={42} />
        <Text style={styles.goBackText}>Go Back</Text>
      </Pressable>
      <Text style={styles.title}>Room Sections</Text>
      <TextInput
        style={styles.input}
        value={nameOfSection}
        onChangeText={setNameOfSection}
        placeholder="Enter a Room Section"
        placeholderTextColor="gray"
      />
      <Pressable style={styles.btn} onPress={handleAddPress}>
        <Text style={styles.btnText}>Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    padding: 20,
  },
  goBackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    // backgroundColor: 'pink',
    marginBottom: 40,
    marginTop: 40,
  },
  goBackText: {
    fontSize: 24,
    color: "#23282C",
    fontWeight: "700",
    marginLeft: 15,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#23282C",
  },
  input: {
    height: 50,
    width: "100%",
    textAlign: "left",
    fontSize: 18,
    color: "#23282C",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "white",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    backgroundColor: "#23282C",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
});
