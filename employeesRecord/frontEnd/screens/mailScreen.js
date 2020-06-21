import React, { useState, useContext, useEffect } from "react";
import { Text, View, StatusBar, Alert, Dimensions } from "react-native";
import {
  TextInput,
  Button,
  Title,
  ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { openInbox } from "react-native-email-link";
import * as IntentLauncher from "expo-intent-launcher";

export default function MailScreen({ navigation, route }) {
  const netInfo = useNetInfo();

  const checkConnectivity = () => {
    if (!netInfo.isConnected) {
      Alert.alert("No internet connection.");
      return false;
    } else {
      return true;
    }
  };

  const openMailApp = () => {
    const activityAction = "android.intent.action.MAIN"; // Intent.ACTION_MAIN
    const intentParams = {
      flags: 268435456, // Intent.FLAG_ACTIVITY_NEW_TASK
      category: "android.intent.category.APP_EMAIL", // Intent.CATEGORY_APP_EMAIL // APP_CONTACTS, APP_MESSAGING, APP_GALLERY, APP_CALENDAR, APP_BROWSER
    };

    IntentLauncher.startActivityAsync(activityAction, intentParams).catch(
      this.handleOpenMailClientErrors
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#3098f2" }}>
      <StatusBar text="white" backgroundColor="#3098f2" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Ionicons name="ios-paper-plane" size={250} color="white" />
      </View>

      <View style={{ flex: 1, alignItems: "center" }}>
        <Title style={{ color: "white", fontSize: 30, fontFamily: "serif" }}>
          Check Your E-mail!!
        </Title>
        <Text
          style={{
            color: "white",
            margin: 10,
            textAlign: "center",
          }}
        >
          E-mail verification link has been sent to {route.params.email}. Kindly
          click on that link to activate your account.
        </Text>

        <Button
          theme={{ colors: { primary: "#e3e4e6" } }}
          icon="gmail"
          style={{ margin: 10 }}
          mode="contained"
          onPress={() => {
            if (checkConnectivity()) {
              navigation.replace("SignIn");
              openMailApp();
            }
          }}
        >
          <Text style={{ textTransform: "capitalize" }}>open mail box</Text>
        </Button>

        <Text
          style={{
            color: "white",
            margin: 10,
            textAlign: "center",
          }}
        >
          Please check your spam folder if you didn't see the mail in the inbox*
        </Text>
      </View>
    </View>
  );
}
