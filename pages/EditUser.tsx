import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useUsers, User } from "../UsersContext";
import Icon from "../components/Icon";
import NavPanel from "../components/NavPanel";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditUser({ navigation }: any) {
  const { currentUser, users, setUser, updateUser, checkLogin } = useUsers();
  const [user, setUserState] = useState<User | null>(null);
  const [login, setLogin] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    console.log(currentUser);
    const userToEdit = users.find(
      (u) => u.login.trim().toLowerCase() === currentUser.trim().toLowerCase()
    );
    if (userToEdit) {
      setUserState(userToEdit);
      setLogin(userToEdit.login);
      setUsername(userToEdit.username);
      setPhone(userToEdit.phone);
      //   setPassword(userToEdit.password);
    }
  }, [currentUser, users]);

  const handleSave = () => {
    if (!login.trim() || !username.trim() || !phone.trim()) {
      alert("All fields are required.");
      return;
    }
    // console.log(
    //   login.trim().toLowerCase() !== user?.login.trim().toLowerCase()
    // );
    // console.log(!checkLogin(login.trim(), ""));
    if (login.trim().toLowerCase() !== user?.login.trim().toLowerCase()) {
      console.log(1);
      if (!user || !checkLogin(login.trim(), "")) {
        return;
      }
    }
    if (password.trim() && confirmPassword.trim()) {
      if (password.trim() !== confirmPassword.trim()) {
        alert("Passwords do not match.");
        return;
      }
    }
    const updatedUser: User = {
      id: user.id || "",
      login: login.trim(),
      username: username.trim(),
      phone: phone.trim(),
      password: password.trim() ? password.trim() : user.password,
    };

    const updatedUsers = users.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    );

    updateUser({
      id: user.id || "",
      login: updatedUser.login,
      username: updatedUser.username,
      phone: updatedUser.phone,
      password: updatedUser.password,
    });

    setUser(updatedUser.login.trim());
    alert("Success!");
    // navigation.goBack();
  };
  const handleExit=async ()=>{
    await AsyncStorage.setItem("currentUser", "");
    navigation.navigate("Login");
  }

  return (
    <View style={styles.container}>
      {/* <Pressable
        onPress={() => navigation.goBack()}
        style={styles.goBackContainer}
      >
        <Icon name="arrow-circle-left" color="#23282C" size={42} />
        <Text style={styles.goBackText}>Go Back</Text>
      </Pressable> */}
      <Text style={styles.title}>Edit User</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Login</Text>
        <TextInput style={styles.input} value={login} onChangeText={setLogin} />
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
        <Text style={styles.label}>
          Password
        </Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="(Leave blank if you don't want to change)"
          placeholderTextColor="gray"
          secureTextEntry
        />
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="(Leave blank if you don't want to change)"
          placeholderTextColor="gray"
          secureTextEntry
        />
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable style={[styles.saveButton, {marginTop: 15}]} onPress={handleExit}>
          <Text style={styles.saveButtonText}>Exit</Text>
        </Pressable>
      </View>
      <NavPanel navigation={navigation} currentItem="EditUser" />
    </View>
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
    paddingTop: 40,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#23282C",
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    color: "#23282C",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#23282C",
    paddingVertical: 12,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
