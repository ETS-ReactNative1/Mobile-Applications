import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  StatusBar,
  Alert,
  Dimensions,
  Linking,
} from "react-native";
import {
  TextInput,
  Button,
  Title,
  ActivityIndicator,
} from "react-native-paper";
import { AntDesign, FontAwesome, Entypo } from "@expo/vector-icons";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import * as Google from "expo-google-app-auth";
import * as Facebook from "expo-facebook";

import { AuthContext } from "../App";

const IOS_CLIENT_ID =
  "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";   // PUT YOUR IOS_CLIENT_ID
const ANDROID_CLIENT_ID =
  "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";   // PUT YOUR ANDROID_CLIENT_ID

const loginConfig = {
  iosClientId: IOS_CLIENT_ID,
  androidClientId: ANDROID_CLIENT_ID,
  scopes: ["profile", "email"],
};

const facebookClientId = "xxxxxxxxxxxxxxxx";   // PUT YOUR FB_CLIENT_ID

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export default function SignUp({ navigation }) {
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);
  const { setLoggedIn, baseURL } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signInWithFacebook = async () => {
    try {
      await Facebook.initializeAsync(facebookClientId);

      const result = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
      });
      //console.log("RESULT : ", result);

      if (result.type === "success") {
        setLoading(true);
        fetch(baseURL + "oauth/facebook", {
          method: "post",
          // headers: new Headers({
          //   Authorization: "Bearer " + token,
          // }),  // OR //
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: result.token,
          }),
        })
          .then((response) => {
            //console.log("response : ", JSON.stringify(response));
            return response.json();
          })
          .then(async (data) => {
            setLoading(false);
            //console.log("data : ", data);
            setEmail(data.user.facebook.email);
            await AsyncStorage.setItem("EmployeesAppToken", data.token);
            setLoggedIn(true);
          })
          .catch((error) => {
            //console.log("Error : ", error);
            setLoading(false);
            Alert.alert("Error from the server.");
          });
      } else {
        // type === 'cancel'
        //console.log("Error occurred.");
        Alert.alert("Facebook login failed.");
      }
    } catch ({ message }) {
      //console.log("Error : ", message);
      Alert.alert(
        "Facebook Login Error",
        "Please check your facebook credentials."
      );
    }
  };

  const signInWithGoogle = async () => {
    try {
      // First- obtain access token from Expo's Google API
      const { type, accessToken, user } = await Google.logInAsync(loginConfig);

      //console.log("type : ", type);
      // console.log("accessToken : ", accessToken);
      if (type === "success") {
        setLoading(true);
        // console.log("user : ", user);
        setEmail(user.email);
        fetch(baseURL + "oauth/google", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
          }),
        })
          .then((response) => {
            //console.log("response : ", JSON.stringify(response));
            return response.json();
          })
          .then(async (data) => {
            setLoading(false);
            //console.log("data : ", data);
            await AsyncStorage.setItem("EmployeesAppToken", data.token);
            setLoggedIn(true);
          })
          .catch((error) => {
            //console.log("Error : ", error);
            setTimeout(() => setLoading(false), 2000);
            Alert.alert("Error from the server.");
          });
      } else {
        // type === 'cancel'
        //console.log("Error occurred.");
        setLoading(false);
        Alert.alert("Google login failed.");
      }
    } catch (error) {
      //console.log("Error : ", error);
      setTimeout(() => setLoading(false), 2000);
      Alert.alert(
        "Google Login Error",
        "Please check your google credentials."
      );
    }
  };

  const sendCredentials = () => {
    fetch(baseURL + "signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        name: name,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        setLoading(false);
        //console.log(data);
        try {
          if (data.error) {
            Alert.alert(data.error);
          } else {
            //console.log("Data from sign request : ", data);
            // await AsyncStorage.setItem("EmployeesAppToken", data.token);
            // setLoggedIn(true);

            //Alert.alert("Account Activation ", data.message);
            navigation.replace("MailScreen", { email });
          }
        } catch (error) {
          //console.log("Error : ", error);
          Alert.alert("Somthing went wrong. Please check your credentials.");
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
          <TextInput
            theme={{ colors: { primary: "#0384fc" } }}
            style={{ margin: 10 }}
            mode="outlined"
            placeholder="Your Name"
            label="Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
            }}
          />
          <TextInput
            keyboardType="email-address"
            theme={{ colors: { primary: "#0384fc" } }}
            style={{ margin: 10 }}
            mode="outlined"
            placeholder="Your E-mail"
            label="E-mail"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <TextInput
            theme={{ colors: { primary: "#0384fc" } }}
            style={{ margin: 10 }}
            mode="outlined"
            placeholder="Your Password"
            secureTextEntry={true}
            label="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            theme={{ colors: { primary: "#0384fc" } }}
            style={{ margin: 10 }}
            mode="outlined"
            placeholder="Confirm Your Password"
            secureTextEntry={true}
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />

          <Button
            theme={{ colors: { primary: "#0384fc" } }}
            icon="login"
            style={{ margin: 10 }}
            mode="contained"
            onPress={() => {
              if (confirmPassword !== password) {
                Alert.alert("Password's Mismatch.");
              } else if (checkConnectivity()) {
                setLoading(true);
                sendCredentials();
              }
            }}
          >
            Sign Up
          </Button>

          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Text
                style={{
                  textDecorationLine: "underline",
                }}
              >
                Click here
              </Text>
            </Text>
          </TouchableOpacity>

          <View
            style={{
              width: windowWidth,
              position: "absolute",
              bottom: "2%",
            }}
          >
            <Button
              theme={{ colors: { primary: "#f0483c" } }}
              icon={() => (
                <AntDesign name="googleplus" size={36} color="white" />
              )}
              style={{ margin: 10, height: 45, justifyContent: "center" }}
              labelStyle={{ fontFamily: "serif" }}
              mode="contained"
              onPress={() => {
                if (checkConnectivity()) {
                  setTimeout(() => setLoading(true), 1500);
                  signInWithGoogle();
                  setTimeout(() => setLoading(false), 1500);
                }
              }}
            >
              <Text style={{ textTransform: "capitalize" }}>
                Sign up with Google
              </Text>
            </Button>
            <Button
              theme={{ colors: { primary: "#3c54f0" } }}
              icon={() => <Entypo name="facebook" size={30} color="white" />}
              style={{ margin: 10, height: 45, justifyContent: "center" }}
              contentStyle={{}}
              labelStyle={{ fontFamily: "serif" }}
              mode="contained"
              onPress={() => {
                if (checkConnectivity()) {
                  signInWithFacebook();
                }
              }}
            >
              <Text style={{ textTransform: "capitalize" }}>
                Sign up with Facebook
              </Text>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}
