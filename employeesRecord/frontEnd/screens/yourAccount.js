import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Linking,
  Platform,
  TouchableOpacity,
  Dimensions,
  Alert,
  AsyncStorage,
} from "react-native";
import {
  Appbar,
  Card,
  Button,
  Title,
  ActivityIndicator,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import {
  MaterialIcons,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { AuthContext } from "../App";
import { ScrollView } from "react-native-gesture-handler";

const screenWidth = Dimensions.get("window").width / 2;
const windowHeight = Dimensions.get("window").height;

const YourAccount = (props) => {
  //console.log(" props : ", props.route.params.email);
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);
  const { setLoggedIn, baseURL } = useContext(AuthContext);

  const deleteAccount = async () => {
    const token = await AsyncStorage.getItem("EmployeesAppToken");
    fetch(baseURL + "delete-account", {
      method: "post",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        setLoading(false);
        await AsyncStorage.removeItem("EmployeesAppToken").then(() => {
          setLoggedIn(false);
        });
        Alert.alert(`Account deleted successfully.`);
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
    <View style={styles.container}>
      <StatusBar backgroundColor="black" />
      <Appbar.Header
        style={{ height: "5%" }}
        theme={{ colors: { primary: "#0384fc" } }}
      >
        <Appbar.BackAction
          onPress={() => props.navigation.navigate("Profiles")}
        />
        <Appbar.Content title="Your Account" />
      </Appbar.Header>
      <View style={{ flex: 1 }}>
        <Card style={{ marginTop: 10, marginHorizontal: 10, elevation: 5 }}>
          <Card.Content>
            <View style={{ flexDirection: "row" }}>
              <MaterialCommunityIcons
                name="account"
                size={30}
                color="#4ab3ed"
              />
              <Text
                style={{
                  alignSelf: "center",
                  marginLeft: 20,
                  elevation: 5,
                  textTransform: "capitalize",
                }}
              >
                {props.route.params.name}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={{ marginTop: 10, marginHorizontal: 10, elevation: 5 }}>
          <Card.Content>
            <View style={{ flexDirection: "row" }}>
              <MaterialIcons name="email" size={30} color="#4ab3ed" />
              <Text
                style={{ alignSelf: "center", marginLeft: 20, elevation: 5 }}
              >
                {props.route.params.email}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          icon="delete"
          theme={{ colors: { primary: "#f0483c" } }}
          style={{ marginHorizontal: "20%", margin: 20 }}
          mode="contained"
          onPress={() => {
            if (checkConnectivity()) {
              Alert.alert(`Delete`, "Do you want to delete your account?", [
                {
                  text: "No",
                  //onPress: () => console.log("Cancel Pressed"),
                },
                {
                  text: "Yes",
                  onPress: () => {
                    if (checkConnectivity()) {
                      setLoading(true);
                      deleteAccount();
                    }
                  },
                },
              ]);
            }
          }}
        >
          Delete Account
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default YourAccount;
