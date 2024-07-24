import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  Alert,
  FlatList,
  Image,
  Platform
} from "react-native";
import Icon from "../components/Icon";
import { useRooms, Section } from "../RoomsContext";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";


export default function AddRoom({ navigation }: any) {
  const [nameOfRoom, setNameOfRoom] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [selectedSections, setSelectedSections] = useState<
    (string | number[])[]
  >([]);
  const { sections, addRoom, rooms } = useRooms();


  
  const handleAddPress = async () => {
    const trimmedName = nameOfRoom.trim();
    const trimmedImage = image.trim();

    if (trimmedName === "") {
      Alert.alert("Error", "Room name cannot be empty!");
      return;
    }

    if (trimmedImage === "") {
      Alert.alert("Error", "Image URL cannot be empty!");
      return;
    }

    const isDuplicate = rooms.some(
      (room) => room.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert("Error", "Room with the same name already exists!");
      return;
    }

    if (selectedSections.length === 0) {
      Alert.alert("Error", "Please select at least one section for the room!");
      return;
    }

    const newRoom = {
      id: uuid.v4(),
      name: trimmedName,
      image: trimmedImage,
      sectionIds: selectedSections,
      devices: [],
    };

    addRoom(newRoom);
    setNameOfRoom("");
    setImage("");
    setSelectedSections([]);
    navigation.navigate("Home");
  };

  const toggleSectionSelection = (sectionId: string | number[]) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const renderSectionItem = ({ item }: { item: Section }) => (
    <Pressable
      style={[
        styles.sectionItem,
        {
          backgroundColor: selectedSections.includes(item.id)
            ? "#e0e0e0"
            : "#f9f9f9",
        },
      ]}
      onPress={() => toggleSectionSelection(item.id)}
    >
      <Text style={styles.sectionText}>{item.name}</Text>
    </Pressable>
  );

  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      //   aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // setImage("data:image/jpeg;base64," + result.assets[0].base64);
      setImage(result.assets[0].uri);
      // if (Platform.OS == "web") {
      //   alert(result.assets[0].uri);
      // } else {
      //   alert(
      //     "data:image/jpeg;base64," + result.assets[0].base64?.substring(0, 40)
      //   );
      // }
    }
  };
  const saveImage = () => {
    setImage(imageUrl);
  };


  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.goBackContainer}
      >
        <Icon name="arrow-circle-left" color="#23282C" size={42} />
        <Text style={styles.goBackText}>Go Back</Text>
      </Pressable>
      <Text style={styles.title}>Add New Room</Text>
      <TextInput
        style={styles.input}
        value={nameOfRoom}
        onChangeText={setNameOfRoom}
        placeholder="Enter Room Name"
        placeholderTextColor="gray"
      />
      <Pressable style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.imagePickerButtonText}>
          Pick an image from the gallery
        </Text>
      </Pressable>
      <Text style={styles.subTitle}>Or</Text>
      <View style={{ flexDirection: "row", gap: 15 }}>
        <TextInput
          style={styles.input}
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="Enter Image URL"
          placeholderTextColor="gray"
        />
        <Pressable style={[styles.imagePickerButton, {paddingHorizontal: 15}]} onPress={saveImage}>
          <Text style={styles.imagePickerButtonText}>Save</Text>
        </Pressable>
      </View>
      {image != null && (
        <View style={{ alignItems: "center" }}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      )}

      <Text style={styles.subTitle}>Select Sections:</Text>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSectionItem}
        contentContainerStyle={styles.list}
      />
      <Pressable style={styles.btn} onPress={handleAddPress}>
        <Text style={styles.btnText}>Add Room</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  imagePickerButton: {
    height: 50,
    backgroundColor: "#23282C",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  imagePickerButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
  image: {
    width: 208,
    height: 235,
    borderRadius: 5,
    marginBottom: 20,
  },
  goBackContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
    marginTop: 20,
  },
  goBackText: {
    fontSize: 24,
    color: "#23282C",
    fontWeight: "700",
    marginLeft: 15,
  },
  title: {
    textAlign: "center",
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
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#23282C",
  },
  sectionItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 18,
    color: "#23282C",
  },
  list: {
    marginBottom: 20,
  },
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 5,
    backgroundColor: "#23282C",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  btnText: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
});
