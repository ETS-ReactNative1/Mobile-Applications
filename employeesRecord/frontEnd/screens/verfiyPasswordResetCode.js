import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import {
  TextInput,
  Button,
  ActivityIndicator,
  Title,
} from "react-native-paper";
import { AntDesign, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import * as IntentLauncher from "expo-intent-launcher";
import { AuthContext } from "../App";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export default function VerifyPasswordResetCode({ navigation, route }) {
  const netInfo = useNetInfo();

  const { baseURL } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const verifyCode = () => {
    fetch(baseURL + "verify-password-reset-code", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: route.params.email,
        code: code,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        setLoading(false);
        try {
          if (data.error) {
            Alert.alert(data.error);
          } else {
            navigation.replace("UpdatePassword", { email: route.params.email });
          }
        } catch (error) {
          //console.log("Error : ", error);
          Alert.alert(
            "Somthing went wrong. Please check your internet connection."
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Error from the server.");
      });
  };

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
    <View>
      <StatusBar backgroundColor="black" />

      {loading === true ? (
        <View
          style={{
            height: windowHeight,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator animating={true} color={"#0384fc"} size="large" />
          <Title style={{ margin: 10 }}>Validating...</Title>
        </View>
      ) : (
        <View
          style={{
            height: windowHeight * 0.9,
            width: windowWidth,
          }}
        >
          <Text style={{ marginTop: 20, textAlign: "center" }}>
            Enter the verification code send at{" "}
            <Text style={{ fontWeight: "bold" }}>{route.params.email}</Text>
          </Text>
          <TextInput
            keyboardType="number-pad"
            theme={{ colors: { primary: "#0384fc" } }}
            style={{ margin: 10 }}
            mode="outlined"
            placeholder="Enter Verification Code"
            label="Verification Code"
            value={code}
            onChangeText={(text) => setCode(text)}
          />

          <Button
            theme={{ colors: { primary: "#0384fc" } }}
            style={{ margin: 10 }}
            //icon="login"
            mode="contained"
            onPress={() => {
              if (checkConnectivity()) {
                setLoading(true);
                verifyCode();
              }
            }}
          >
            Verify Code
          </Button>

          <Button
            theme={{ colors: { primary: "#0384fc" } }}
            icon="gmail"
            style={{ marginTop: 20, marginHorizontal: 80 }}
            mode="contained"
            onPress={() => {
              if (checkConnectivity()) {
                openMailApp();
              }
            }}
          >
            Open Mail Box
          </Button>

          <Text
            style={{ marginTop: 10, textAlign: "center", marginHorizontal: 40 }}
          >
            Please check your spam folder if you didn't see the mail in the
            inbox*
          </Text>
        </View>
      )}
    </View>
  );
}
