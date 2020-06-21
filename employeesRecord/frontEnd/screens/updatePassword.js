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
import { AuthContext } from "../App";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export default function UpdatePassword({ navigation, route }) {
  const netInfo = useNetInfo();

  const { baseURL } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePassword = () => {
    fetch(baseURL + "update-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: route.params.email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        setLoading(false);
        try {
          if (data.error) {
            Alert.alert(data.error);
          } else {
            Alert.alert(data.message);
            navigation.goBack();
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
            Successfully verified. Reset your password.
          </Text>
          <TextInput
            theme={{ colors: { primary: "#0384fc" } }}
            style={{ margin: 10 }}
            mode="outlined"
            placeholder="New Password"
            secureTextEntry={true}
            label="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            theme={{ colors: { primary: "#0384fc" } }}
            style={{ margin: 10 }}
            mode="outlined"
            placeholder="Confirm New Password"
            secureTextEntry={true}
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />

          <Button
            theme={{ colors: { primary: "#0384fc" } }}
            //icon="login"
            style={{ margin: 10 }}
            mode="contained"
            onPress={() => {
              if (password.length < 6) {
                Alert.alert("Password length must be minimum 6 characters.");
              } else if (confirmPassword !== password) {
                Alert.alert("Password's Mismatch.");
              } else if (checkConnectivity()) {
                setLoading(true);
                updatePassword();
              }
            }}
          >
            Reset Password
          </Button>
        </View>
      )}
    </View>
  );
}
