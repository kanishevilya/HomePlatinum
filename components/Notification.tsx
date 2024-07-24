import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: true
    })
});

export type notificationType={
    content: {
        title: string
        body: string
        // data: { someData: "Что-то ещё" }
    },
    trigger: {
        seconds: number
    }
}

export async function sendNotification(content: notificationType) {
    await Notifications.scheduleNotificationAsync({
        content: content.content,
        trigger: content.trigger
    });
}

async function registerForPush() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== "granted") {
        alert("Ошибка получения прав!");
        return;
    }
}

// type NotificationSubscription = {
//     remove: () => void;
// };

export function NotificationsInit() {
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
    const responseListener = useRef<Notifications.Subscription | undefined>(undefined);

    useEffect(() => {
        registerForPush();

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.info(response);
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, []);



    // return (
    //     <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
    //         <Text>{notification && notification.request.content.title}</Text>
    //         <Text>{notification && notification.request.content.body}</Text>
    //         <Button title="Отправить пуш" onPress={sendNotification}/>
    //     </View>
    // );
}