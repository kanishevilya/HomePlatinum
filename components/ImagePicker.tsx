import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { useEffect, useState } from "react";
import { View,Text, Image} from "react-native";

function ImagePicker() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function func() {
      let img = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
      });
      if (img.assets && img.assets.length) {
        console.log(img.assets[0].uri);
        alert(img.assets[0].uri);
        setSelectedImage(img.assets[0].uri);
        let formData = new FormData();
        formData.append("file", {
          uri: img.assets[0].uri,
          name: "photo.jpg",
          type: "image/jpeg",
        } as any);
        alert(JSON.stringify(formData));
      }
    }
    func();
  }, []);

  return (
    <View>
      <Text>{selectedImage}</Text>
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={{ width: 200, height: 200 }}
        />
      )}
    </View>
  );
}
