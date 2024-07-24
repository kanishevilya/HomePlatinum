import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { Device } from "./DevicesContext";
import { Room, Section } from "./RoomsContext";

export type User = {
  id: string | number[];
  login: string;
  username: string;
  phone: string;
  password: string;
};

type UsersContexType = {
  currentUser: string;
  users: User[];
  checkLogin: (login: string, password: string) => boolean;
  setUser: (login: string) => void;
  addUser: (
    login: string,
    username: string,
    phone: string,
    password: string
  ) => boolean;
  updateUser: (updatedUser: User) => void;
};

const UsersContext = createContext<UsersContexType>({} as UsersContexType);

const UserMock: User = {
  id: uuid.v4(),
  login: "Davahkiin",
  username: "Ilya Kanishev",
  phone: "87020540223",
  password: "123456789",
};

const PATH = "http://192.168.1.100:8090/itstep/user/";

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // const response = await fetch(PATH + "getUsers");
        // let savedUsers;
        // console.log(response);
        // if (!response.ok) {
        //   console.log(`Error: ${response.statusText}`);
        //   savedUsers = (await AsyncStorage.getItem("users")) as string;
        // }
        // let savedUsers = await response.json();
        let savedUsers = (await AsyncStorage.getItem("users")) as string;
        console.log(savedUsers);
        if (savedUsers) {
          let parsedUsers = JSON.parse(savedUsers);
          if (parsedUsers.length) {
            setUsers(parsedUsers);
          } else {
            setUsers([UserMock]);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    const loadCurUser = async () => {
      let savedUser = (await AsyncStorage.getItem("currentUser")) as string;
      if (savedUser) {
        setCurrentUser(savedUser);
      }
    };
    loadCurUser();
    loadUsers();
  }, []);

  useEffect(() => {
    const saveUsers = async () => {
      await AsyncStorage.setItem("users", JSON.stringify(users));
    };
    saveUsers();
  }, [users]);

  useEffect(() => {
    const saveUser = async () => {
      await AsyncStorage.setItem("currentUser", currentUser);
    };
    saveUser();
  }, [currentUser]);

  const checkLogin = (login: string, password: string) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].login.trim().toLowerCase() === login.trim().toLowerCase()) {
        if (users[i].password === password) {
          return true;
        } else {
          alert("This login is already taken!");
          return false;
        }
      }
    }
    
    return true;
  };
  const setUser = (login: string) => {
    setCurrentUser(login);
  };
  const addUser = (
    login: string,
    username: string,
    phone: string,
    password: string
  ) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].login.trim().toLowerCase() === login.toLowerCase()) {
        alert("This login is already taken");
        return false;
      }
      if (users[i].phone === phone) {
        alert("This phone number is already taken");
        return false;
      }
    }
    setUsers([
      ...users,
      {
        id: uuid.v4(),
        login: login,
        username: username,
        phone: phone,
        password: password,
      },
    ]);
    return true;
  };

  const updateUser = (updatedUser: User) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };
  return (
    <UsersContext.Provider
      value={{ updateUser, currentUser, users, checkLogin, setUser, addUser }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers should use UsersProvider");
  } else {
    return context;
  }
}
