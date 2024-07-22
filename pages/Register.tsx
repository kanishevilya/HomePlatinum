import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import handleBiometricAuth from "../components/ConfirmBiometric";

import LockIcon from "../assets/images/LockIcon.svg";
import AddUser from "../assets/images/AddUserIcon.svg";
import { useState } from "react";
import { useUsers } from "../UsersContext";

const lockIcon = require("../assets/images/LockIcon.svg");

export function HR() {
  return (
    <View
      style={{
        width: 90,
        borderBottomWidth: 1,
        marginTop: 2,
        borderBlockColor: "rgba(35, 40, 44, 0.4)",
      }}
    />
  );
}

export default function Register({ navigation }: any) {
  const [login, setLogin] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const { addUser } = useUsers();

  function registerHandle() {
    if (login.trim() && username.trim() && phone.trim() && password.trim()) {
      if (
        addUser(login.trim(), username.trim(), phone.trim(), password.trim())
      ) {
        alert("Пользователь добавлен!");
        navigation.navigate("Login");
      }
    } else {
      alert("Вы должны заполнить все поля!");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconView}>
        <AddUser />
        <Text style={styles.registerText}>Sign Up</Text>
      </View>
      <View style={styles.registerBlock}>
        <TextInput
          value={login}
          onChangeText={setLogin}
          style={[styles.input, styles.firstInput]}
          placeholder="Login"
          placeholderTextColor="gray"
        />
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="gray"
        />
        <TextInput
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor="gray"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor="gray"
        />
        <Pressable style={styles.btn} onPress={registerHandle}>
          <Text style={styles.btnText}>Register</Text>
        </Pressable>
        <View style={styles.row}>
          <Text style={styles.grayText}>Already have an account ?</Text>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={styles.underBtnLink}>Sign In now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
  },
  textView: {
    marginRight: 20,
    marginTop: 60,
  },
  blueText: {
    color: "#116092",
    fontWeight: "600",
  },
  mainTitle: {
    color: "#23282C",
    // fontFamily: "Poppins",
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: 4,
    textAlign: "left",
  },
  title: {
    color: "#435563",
    fontSize: 36,
    fontWeight: "500",
    textAlign: "left",
    paddingTop: 10,
    paddingLeft: 3,
  },
  subTitle: {
    opacity: 0.3,
    color: "#23282C",
    fontSize: 24,
    fontWeight: "400",
    paddingTop: 4,
    paddingLeft: 3,
  },
  registerText: {
    width: 195,
    textAlign: "center",
    fontSize: 50,
    fontWeight: "500",
    color: "#435563",
  },
  registerBlock: {
    flex: 1,
    alignItems: "center",
    marginTop: 60,
  },
  firstInput: {
    marginTop: 0,
  },
  input: {
    marginTop: 30,
    height: 64,
    width: 326,
    textAlign: "left",
    fontSize: 20,
    color: "#23282C",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 12,

    backgroundColor: "white",
    // backgroundColor: "linear-gradient(180.00deg, rgb(237, 237, 237) -0.18, rgb(255, 255, 255) 1.1)",
    paddingHorizontal: 20,

    shadowColor: "#23282C",
    elevation: 10,
  },
  iconView: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  text: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "800",
    padding: 10,
    color: "cadetblue",
  },
  btn: {
    width: 326,
    height: 64,
    marginTop: 50,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(111, 111, 111, 0.9)",
    backgroundColor: "#23282C",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    userSelect: "none",
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
  grayText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgb(35, 40, 44)",
    opacity: 0.4,
  },
  underBtnLink: {
    fontSize: 16,
    fontWeight: "700",
    color: "#217EC9",
  },
  biometricBtn: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    width: 147,
    height: 62,
    borderRadius: 24,
    backgroundColor: "white",

    shadowColor: "#23282C",
    elevation: 8,
  },
  biometricBtnText: {
    fontWeight: "500",
    fontSize: 14,
    color: "#23282C",
  },
});
