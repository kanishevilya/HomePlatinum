import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

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
};

const UsersContext = createContext<UsersContexType>({} as UsersContexType);

const UserMock: User = {
  id: uuid.v4(),
  login: "Davahkiin",
  username: "Ilya Kanishev",
  phone: "87020540223",
  password: "123456789",
};

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      let savedUsers = (await AsyncStorage.getItem("users")) as string;
      if (savedUsers) {
        let parsedUsers = JSON.parse(savedUsers);
        setUsers([...parsedUsers, UserMock]);
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
      await AsyncStorage.setItem("currentUser", JSON.stringify(currentUser));
    };
    saveUser();
  }, [currentUser]);

  const checkLogin = (login: string, password: string) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].login === login) {
        if (users[i].password === password) {
          return true;
        } else {
          alert("Данный логин уже занят!");
          return false;
        }
      }
    }
    return false;
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
    for(let i = 0; i<users.length; i++){
      if(users[i].login===login){
        alert("Данный логин уже занят");
        return false;
      }
      if(users[i].phone===phone){
        alert("Данный номер телефона уже занят");
        return false;
      }
    }
    setUsers([...users, {
      id: uuid.v4(),
      login: login,
      username: username,
      phone: phone,
      password: password
    }]);
    return true;
  };
  return (
    <UsersContext.Provider value={{ currentUser, users, checkLogin, setUser, addUser }}>
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
