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
import { MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { AuthContext } from "../App";
import { ScrollView } from "react-native-gesture-handler";

const screenWidth = Dimensions.get("window").width / 2;
const windowHeight = Dimensions.get("window").height;

const ViewProfile = (props) => {
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);

  const { baseURL } = useContext(AuthContext);

  const {
    _id,
    name,
    email,
    post,
    phone,
    salary,
    picture,
  } = props.route.params.item;

  const deleteEmployee = async () => {
    const token = await AsyncStorage.getItem("EmployeesAppToken");
    fetch(baseURL + "delete-data", {
      method: "post",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.route.params.id,
        employeeid: _id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        Alert.alert(`Profile deleted successfully.`);
        props.navigation.navigate("Profiles", {});
      })
      .catch((error) => {
        Alert.alert(
          "Somthing went wrong. Please check your internet connection."
        );
      });
  };

  const openDial = (number) => {
    if (Platform.OS === "android") {
      Linking.openURL(`tel:${number}`);
    } else {
      Linking.openURL(`telprompt: ${number}`);
    }
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

        <Appbar.Content title="Profile" />
      </Appbar.Header>

      {loading === true ? (
        <View
          style={{
            height: windowHeight,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator animating={true} color={"#0384fc"} size="large" />
          <Title style={{ margin: 10 }}>Deleting...</Title>
        </View>
      ) : (
        <ScrollView>
          <LinearGradient
            colors={["#0384fc", "#03cefc"]}
            style={{ height: "15%", justifyContent: "center" }}
          />
          <View style={{ alignItems: "center", marginTop: -80 }}>
            <Image
              style={{ height: 160, width: 160, borderRadius: 80 }}
              source={{ uri: picture }}
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <Title>{name}</Title>
            <Text>{post}</Text>
          </View>

          <View
            style={{
              height: windowHeight,
              marginTop: "5%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (checkConnectivity()) {
                  Linking.openURL(`mailto: ${email}`);
                }
              }}
            >
              <Card style={{ marginTop: 5, marginHorizontal: 5, elevation: 5 }}>
                <Card.Content>
                  <View style={{ flexDirection: "row" }}>
                    <MaterialIcons name="email" size={30} color="#4ab3ed" />
                    <Text style={{ margin: 5, marginLeft: 20 }}>{email}</Text>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (checkConnectivity()) {
                  openDial("+91" + phone);
                }
              }}
            >
              <Card style={{ marginTop: 5, marginHorizontal: 5, elevation: 5 }}>
                <Card.Content>
                  <View style={{ flexDirection: "row" }}>
                    <Feather name="phone-call" size={30} color="#4ab3ed" />
                    <Text style={{ margin: 5, marginLeft: 20 }}>
                      {"+91-" + phone}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>

            <Card style={{ marginTop: 5, marginHorizontal: 5, elevation: 5 }}>
              <Card.Content>
                <View style={{ flexDirection: "row" }}>
                  <FontAwesome name="rupee" size={30} color="#4ab3ed" />
                  <Text style={{ margin: 5, marginLeft: 35 }}>{salary}</Text>
                </View>
              </Card.Content>
            </Card>
            <Button
              style={{ marginTop: 25, margin: 20, marginHorizontal: "10%" }}
              icon="square-edit-outline"
              mode="contained"
              theme={{ colors: { primary: "#0384fc" } }}
              onPress={() => {
                if (checkConnectivity()) {
                  props.navigation.navigate("CreateEmployee", {
                    id: props.route.params.id,
                    _id,
                    name,
                    email,
                    post,
                    phone,
                    salary,
                    picture,
                  });
                }
              }}
            >
              Edit profile
            </Button>
            <Button
              style={{ marginTop: 5, marginHorizontal: "30%" }}
              icon="delete"
              mode="contained"
              theme={{ colors: { primary: "#0384fc" } }}
              onPress={() => {
                if (checkConnectivity()) {
                  Alert.alert(`Delete`, "Do you want to delete this profile?", [
                    {
                      text: "No",
                      //onPress: () => console.log("Cancel Pressed"),
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        if (checkConnectivity()) {
                          setLoading(true);
                          deleteEmployee();
                        }
                      },
                    },
                  ]);
                }
              }}
            >
              Delete
            </Button>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ViewProfile;
