import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then((statusObj) => {
        if (statusObj.status !== "granted") {
          return Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        return statusObj;
      })
      .then((statusObj) => {
        if (statusObj.status !== "granted") {
          throw new Error("Notifications Permission denied");
        }
      })
      .then(() => {
        return Notifications.getExpoPushTokenAsync();
      })
      .then((tokenObj) => {
        //console.log(tokenObj);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      (notif) => {
        console.log(notif);
      }
    );
    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, []);

  const triggerNotificationHandler = () => {
    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: "First notification",
    //     body: "Sending my first local notification with expo notification",
    //   },
    //   trigger: {
    //     seconds: 5,
    //   },
    // });
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Host": "exp.host",
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: process.env.MY_EXPO_PUSH_TOKEN,//add your push token
        title: "A self notification",
        body: "Sent to myself pretty fast few seconds only."
      })
    })
    .catch(err=>console.log(err));
  };
  return (
    <View style={styles.container}>
      <Button
        title="Create notification"
        onPress={triggerNotificationHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
