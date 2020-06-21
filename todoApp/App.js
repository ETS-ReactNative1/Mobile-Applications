import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  ScrollView,
  Platform,
  BackHandler,
} from "react-native";
import { Button, Appbar, TextInput, Card, Title } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

export default function App() {
  const [item, setitem] = useState({ id: Math.random(), data: "" });
  const [items, setitems] = useState([]);
  const [saved, setSaved] = useState(false);

  const myTextInput = React.createRef();

  const retrieveData = async () => {
    try {
      const itemsString = await AsyncStorage.getItem("list");

      if (itemsString !== null) {
        // We have data!!
        const itemsArray = JSON.parse(itemsString);
        setitems(() => itemsArray);
        //console.log(itemsArray);
      }
    } catch {
      (error) => console.log(error);
    }
  };

  const storeData = async () => {
    try {
      const itemsString = JSON.stringify(items);
      await AsyncStorage.setItem("list", itemsString);
    } catch (error) {
      console.log(error);
    }
  };

  const removeData = async (it) => {
    const newArray = items.filter((item) => {
      return item.id !== it.id;
    });
    try {
      await AsyncStorage.removeItem("list");
    } catch {
      (error) => console.log(error);
    } finally {
      setitems(() => newArray);
      try {
        const itemsString = JSON.stringify(newArray);
        await AsyncStorage.setItem("list", itemsString);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    //await AsyncStorage.clear();
    retrieveData();
  }, []);

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", () => {
  //     Alert.alert("Save List", "Do you want to save the list?", [
  //       { text: "No", onPress: () => BackHandler.exitApp() },
  //       {
  //         text: "Yes",
  //         onPress: () => {
  //           storeData();
  //           Alert.alert("List saved successfully", "", [
  //             {
  //               text: "Ok",
  //               onPress: () => BackHandler.exitApp(),
  //             },
  //           ]);
  //         },
  //       },
  //     ]);

  //     return true;
  //   });
  //   return () => {
  //     BackHandler.removeEventListener("hardwareBackPress", () => {});
  //   };
  // }, []);

  function additem() {
    setitems((items) => [item, ...items]);
  }

  if (items.length > 0) {
    itemslist = items.map((item) => {
      return (
        <View style={{ marginBottom: 10, elevation: 5 }} key={item.id}>
          <Card>
            <Card.Content>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 10 }}>
                  <Title>{item.data}</Title>
                </View>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Delete",
                        "Do you want to delete this item?",
                        [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                          },
                          {
                            text: "OK",
                            onPress: () => removeData(item),
                          },
                        ]
                      );
                    }}
                  >
                    <MaterialIcons name="delete" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      );
    });
  } else {
    itemslist = <Text style={{ textAlign: "center" }}>No Items</Text>;
  }
  return (
    <View style={styles.container}>
      <Appbar.Header style={{ height: "5%" }}>
        <Appbar.Content title="Make List" style={{ alignItems: "center" }} />
      </Appbar.Header>
      <TextInput
        ref={myTextInput}
        style={{ margin: 10 }}
        mode="outlined"
        label="Add an item"
        placeholder="Type here"
        value={item.data || ""}
        onChangeText={(text) => {
          setitem({ id: Math.random(), data: text });
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          margin: 10,
        }}
      >
        <Button
          icon="plus"
          mode="contained"
          onPress={() => {
            if (myTextInput.current.root._getText() === "") {
              //console.log("Empty");
              //console.log(typeof myTextInput.current.root._getText());
            } else {
              additem();
              setitem({ id: Math.random(), data: "" });
              //storeData();
              //setSaved(false);
            }
          }}
        >
          Add item
        </Button>
        <Button
          icon="format-list-bulleted"
          mode="contained"
          onPress={() => {
            storeData();
            Alert.alert("List saved successfully.");
            setitem({ id: Math.random(), data: "" });
            //setSaved(true);
            //myTextInput.current.clear();
          }}
        >
          save list
        </Button>
      </View>
      <ScrollView style={{ margin: 5 }}>{itemslist}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
