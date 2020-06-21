import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  Alert,
  AsyncStorage,
  Dimensions,
} from "react-native";
import {
  Appbar,
  Card,
  Button,
  Title,
  Avatar,
  Paragraph,
  FAB,
  ActivityIndicator,
} from "react-native-paper";

import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import constants from "expo-constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../App";

const windowHeight = Dimensions.get("window").height;

export default function Profiles(props) {
  // const mycards = [
  //   {
  //     _id: "1",
  //     name: "Darshan Agrawal",
  //     post: "App Developer",
  //     email: "darshanagrawal8@gmail.com",
  //     phone: "9131642356",
  //     salary: "28 LPA",
  //     picture: `https://picsum.photos/${Math.floor(Math.random() * 10)}00`,
  //   },
  //   {
  //     _id: "2",
  //     name: "Harsh Mehta",
  //     post: "Company Secretary",
  //     email: "harshmehta@gmail.com",
  //     phone: "7724010903",
  //     salary: "28 LPA",
  //     picture: `https://picsum.photos/${Math.floor(Math.random() * 10)}00`,
  //   },
  // ];
  const netInfo = useNetInfo();

  const { setLoggedIn, baseURL } = useContext(AuthContext);

  const [mycards, setMycards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  //const [userdata, setUserdata] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const fetchData = async () => {
    const token = await AsyncStorage.getItem("EmployeesAppToken");
    fetch(baseURL + "get-data", {
      headers: new Headers({
        //Authorization: "Bearer " + token,
        Authorization: token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        switch (data.method) {
          case "local": {
            setEmail(data.local.email);
            setName(data.local.name);
            break;
          }
          case "google": {
            setEmail(data.google.email);
            setName(data.google.name);
            break;
          }
          case "facebook": {
            setEmail(data.facebook.email);
            setName(data.facebook.name);
            break;
          }
          default:
            break;
        }

        setId(data._id);
        setMycards(data.userInfo);
        //setUserdata(data.info);
        setLoading(false);
      })
      .catch((error) => {
        Alert.alert(
          "Somthing went wrong. Please check your internet connection."
        );
        //console.log("ERROR : ", error);
      });
  };
  useEffect(() => {
    fetchData();
  }, [props]);

  const renderCards = (item) => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate("ViewProfile", { item, id })}
      >
        <Card
          style={{
            marginBottom: 5,
            elevation: 5,
            marginHorizontal: 3,
          }}
        >
          <Card.Content>
            <View style={{ flexDirection: "row" }}>
              <Avatar.Image
                size={70}
                source={{ uri: item.picture }}
                theme={{ colors: { primary: "#0384fc" } }}
              />
              <View style={{ marginHorizontal: 10, fontSize: 25 }}>
                <Title>{item.name}</Title>
                <Paragraph>{item.post}</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const logout = () => {
    AsyncStorage.removeItem("EmployeesAppToken").then(() => {
      setLoggedIn(false);
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
        style={{ height: "4%", alignItems: "center" }}
        theme={{ colors: { primary: "#0384fc" } }}
      >
        <Appbar.Content
          title="Profiles"
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "2%",
            marginLeft: "30%",
          }}
        />

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("SearchScreen", { mycards, id });
          }}
        >
          <Appbar.Action icon="magnify" color="white" size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("YourAccount", { email, name });
          }}
        >
          <Appbar.Action icon="account" color="white" size={30} />
        </TouchableOpacity>
      </Appbar.Header>

      {loading === true ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator animating={true} color={"#0384fc"} size="large" />
          <Title style={{ margin: 10 }}>Loading Profiles...</Title>
        </View>
      ) : (
        <View style={{ flex: 1, marginTop: 5 }}>
          <FlatList
            data={mycards}
            renderItem={({ item }) => {
              return renderCards(item);
            }}
            keyExtractor={(item) => item._id} //Key must be in of string type
            onRefresh={() => fetchData()}
            refreshing={loading}
            ListEmptyComponent={() => (
              <Title
                style={{ textAlign: "center", marginTop: windowHeight / 2.5 }}
              >
                Add Profiles
              </Title>
            )}
          />
        </View>
      )}

      <Button
        style={styles.logout}
        icon="logout"
        mode="contained"
        theme={{ colors: { primary: "#0384fc" } }}
        onPress={() => {
          if (checkConnectivity()) {
            Alert.alert("Log Out", "Do you want to log out?", [
              { text: "No" },
              {
                text: "Yes",
                onPress: () => {
                  if (checkConnectivity()) {
                    logout();
                  }
                },
              },
            ]);
          }
        }}
      >
        Logout
      </Button>

      <FAB
        //onPress={() => props.navigation.navigate("CreateEmployee", { id })}
        onPress={() => {
          if (checkConnectivity()) {
            props.navigation.navigate("CreateEmployee", { id });
          }
        }}
        style={styles.fab}
        icon="plus"
        theme={{ colors: { accent: "#0384fc" } }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    //marginTop: constants.statusBarHeight,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  logout: {
    position: "absolute",
    margin: 20,
    bottom: 0,
    marginHorizontal: "30%",
  },
});
