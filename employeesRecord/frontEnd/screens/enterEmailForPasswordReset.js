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

export default function EnterEmailForPasswordReset({ navigation }) {
  const netInfo = useNetInfo();

  const { baseURL } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const sendCode = () => {
    fetch(baseURL + "reset-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        setLoading(false);
        try {
          if (data.error) {
            Alert.alert(data.error);
          } else {
            //console.log("Data from code request : ", data);
            navigation.replace("VerfiyPasswordResetCode", { email });
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
            Please provide your E-mail Id
          </Text>
          <TextInput
            autoCompleteType="email"
            keyboardType="email-address"
            theme={{ colors: { primary: "#0384fc" } }}
            style={{ margin: 10 }}
            mode="outlined"
            placeholder="Your E-mail"
            label="E-mail"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <Button
            theme={{ colors: { primary: "#0384fc" } }}
            style={{ margin: 10 }}
            //icon="login"
            mode="contained"
            onPress={() => {
              if (checkConnectivity()) {
                setLoading(true);
                sendCode();
              }
            }}
          >
            Send Code
          </Button>
        </View>
      )}
    </View>
  );
}
