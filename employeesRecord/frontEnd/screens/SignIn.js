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
import * as Google from "expo-google-app-auth";
import * as Facebook from "expo-facebook";

import { AuthContext } from "../App";

const IOS_CLIENT_ID =
  "337682953368-g4tsca29f5kdm2n5lnaph1n40ph9l6rj.apps.googleusercontent.com";
const ANDROID_CLIENT_ID =
  "337682953368-7fsvdq1ghqlfc1rdiaummtq9h6ohfj6n.apps.googleusercontent.com";

const loginConfig = {
  iosClientId: IOS_CLIENT_ID,
  androidClientId: ANDROID_CLIENT_ID,
  scopes: ["profile", "email"],
};

const facebookClientId = "273711990504742";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export default function SignIn({ navigation }) {
  const netInfo = useNetInfo();

  // NetInfo.addEventListener((state) => {
  //   //console.log(netInfo.isConnected);
  // });
  const [loading, setLoading] = useState(false);
  const { setLoggedIn, baseURL } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithFacebook = async () => {
    try {
      await Facebook.initializeAsync(facebookClientId);
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
      });

      if (type === "success") {
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
            access_token: token,
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
        //console.log("user : ", user);
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
            setLoading(false);
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
      setLoading(false);
      Alert.alert(
        "Google Login Error",
        "Please check your google credentials."
      );
    }
  };

  const sendCredentials = () => {
    fetch(baseURL + "signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
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
            //console.log("Data from sign request : ", data);
            await AsyncStorage.setItem("EmployeesAppToken", data.token);
            setLoggedIn(true);
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

          <TextInput
            theme={{ colors: { primary: "#0384fc" } }}
            style={{ margin: 10 }}
            mode="outlined"
            placeholder="Your Password"
            label="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <Button
            theme={{ colors: { primary: "#0384fc" } }}
            style={{ margin: 10 }}
            icon="login"
            mode="contained"
            onPress={() => {
              if (checkConnectivity()) {
                setLoading(true);
                sendCredentials();
              }
            }}
          >
            Sign In
          </Button>

          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={{ textAlign: "center" }}>
              Don't have an account?{" "}
              <Text
                style={{
                  textDecorationLine: "underline",
                }}
              >
                Click here
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("EnterEmailForPasswordReset")}
          >
            <Text
              style={{
                textAlign: "center",
                margin: 10,
                // textDecorationLine: "underline",
              }}
            >
              Forgot Password?
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
                  setLoading(true);
                  signInWithGoogle();
                }
              }}
            >
              <Text style={{ textTransform: "capitalize" }}>
                Sign in with Google
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
                Sign in with Facebook
              </Text>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}
