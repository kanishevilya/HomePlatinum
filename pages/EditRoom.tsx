import React, { useEffect, useState } from "react";
// import RNFS from "react-native-fs";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useRooms, Room, Section } from "../RoomsContext";
import * as ImagePicker from "expo-image-picker";
import Icon from "../components/Icon";

export default function EditRoom({ navigation, route }: any) {
  const { roomId } = route.params;
  const { rooms, sections, updateRoom } = useRooms();
  const [room, setRoom] = useState<Room | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedSections, setSelectedSections] = useState<
    (string | number[])[]
  >([]);

  useEffect(() => {
    const roomToEdit = rooms.find((r) => r.id === roomId);
    if (roomToEdit) {
      setRoom(roomToEdit);
      setName(roomToEdit.name);
      setImage(roomToEdit.image);
      console.log(roomToEdit.image);
      setSelectedSections(roomToEdit.sectionIds);
    }
  }, [roomId, rooms]);

  //   async function getBase64FromUri(uri: string) {
  //     try {
  //       const filePath = uri.replace("file://", "");
  //       const base64 = await RNFS.readFile(filePath, "base64");
  //       return `data:image/jpeg;base64,${base64}`;
  //     } catch (error) {
  //       console.error(error);
  //       return null;
  //     }
  //   }

  const handleSave = () => {
    if (!room) return;
    const updatedRoom = {
      ...room,
      name: name,
      image: image,
      sectionIds: selectedSections,
    };
    console.log(updatedRoom);
    updateRoom(roomId, updatedRoom);
    Alert.alert(
      "Room updated",
      "The room details have been updated successfully."
    );
    navigation.goBack();
  };

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
  const toggleSection = (sectionId: string | number[]) => {
    setSelectedSections((prevSelectedSections) => {
      if (prevSelectedSections.includes(sectionId)) {
        return prevSelectedSections.filter((id) => id !== sectionId);
      } else {
        return [...prevSelectedSections, sectionId];
      }
    });
  };

  if (!room) {
    return (
      <View style={styles.container}>
        <Text>Room not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.goBackContainer}
      >
        <Icon name="arrow-circle-left" color="#23282C" size={42} />
        <Text style={styles.goBackText}>Go Back</Text>
      </Pressable>
      <Text style={styles.title}>Edit Room</Text>
      <TextInput
        style={styles.input}
        placeholder="Room Name"
        value={name}
        onChangeText={setName}
      />
      <Pressable style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.imagePickerButtonText}>
          Pick an image from the gallery
        </Text>
      </Pressable>
      <Text style={styles.subTitle}>Or</Text>
      <View style={{ flexDirection: "row", gap: 15 }}>
        <TextInput
          style={[styles.input, { width: "75%" }]}
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="Enter Image URL"
          placeholderTextColor="gray"
        />
        <Pressable
          style={[styles.imagePickerButton, { paddingHorizontal: 15, flex: 1 }]}
          onPress={saveImage}
        >
          <Text style={styles.imagePickerButtonText}>Save</Text>
        </Pressable>
      </View>
      {image != null && (
        <View style={{ alignItems: "center" }}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      )}
      <Text style={styles.subTitle}>Assign Sections:</Text>
      <View style={styles.list}>
        {sections.map((section) => (
          <Pressable
            key={section.id.toString()}
            style={[
              styles.sectionItem,
              selectedSections.includes(section.id) && styles.selectedSection,
            ]}
            onPress={() => toggleSection(section.id)}
          >
            <View style={styles.sectionContent}>
              <Text style={styles.sectionText}>{section.name}</Text>
              <Text style={styles.roomCount}>
                {section.roomIds.length} rooms
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>Save Changes</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  goBackContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
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
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#23282C",
  },
  subTitle: {
    fontSize: 20,
    color: "#23282C",
    marginBottom: 10,
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
  list: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedSection: {
    backgroundColor: "#e0e0e0",
  },
  sectionContent: {
    flex: 1,
    flexDirection: "column",
  },
  sectionText: {
    fontSize: 18,
    color: "#23282C",
  },
  roomCount: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 5,
    backgroundColor: "#23282C",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
});
