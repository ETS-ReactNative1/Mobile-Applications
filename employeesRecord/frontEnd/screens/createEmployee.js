import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Dimensions,
  AsyncStorage,
} from "react-native";
import {
  Appbar,
  Button,
  TextInput,
  Title,
  ActivityIndicator,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { AuthContext } from "../App";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

//import TextInputMask from "react-native-text-input-mask";
const windowHeight = Dimensions.get("window").height;

const CreateEmployee = (props) => {
  const netInfo = useNetInfo();

  const { baseURL } = useContext(AuthContext);

  const getDetails = (type) => {
    if (props.route.params?.name) {
      switch (type) {
        case "name":
          return props.route.params.name;
        case "email":
          return props.route.params.email;
        case "phone":
          return props.route.params.phone;
        case "salary":
          return props.route.params.salary;
        case "picture":
          return props.route.params.picture;
        case "post":
          return props.route.params.post;
      }
    } else {
      return null;
    }
  };
  const defaultPicture =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQvv66dkuaF9-CWYAWvoFGh2Tg-s1OaqO1h5_1ZkHm-idpYoPTb&usqp=CAU";

  const [name, setName] = useState(getDetails("name"));
  const [email, setEmail] = useState(getDetails("email"));
  const [phone, setPhone] = useState(getDetails("phone"));
  const [salary, setSalary] = useState(getDetails("salary"));
  const [picture, setPicture] = useState(
    getDetails("picture") || defaultPicture
  );
  const [post, setPost] = useState(getDetails("post"));
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitData = async () => {
    const token = await AsyncStorage.getItem("EmployeesAppToken");
    fetch(baseURL + "send-data", {
      method: "post",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.route.params.id, //  document user id
        name: name,
        email: email,
        phone: phone,
        salary: salary,
        post: post,
        picture: picture,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log("Successfully saved : ", data);
        setLoading(false);
        Alert.alert(`Profile saved successfully.`, "", [
          {
            text: "OK",
            onPress: () => props.navigation.navigate("Profiles", {}),
          },
        ]);
      })
      .catch((error) => {
        Alert.alert(
          "Somthing went wrong. Please check your internet connection."
        );
      });
  };

  const updateDetails = async () => {
    const token = await AsyncStorage.getItem("EmployeesAppToken");
    fetch(baseURL + "update-data", {
      method: "post",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.route.params.id, // document user id
        employeeid: props.route.params._id, // employee id inside that document
        name: name,
        email: email,
        phone: phone,
        salary: salary,
        post: post,
        picture: picture,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        Alert.alert(`Profile updated successfully.`, "", [
          {
            text: "OK",
            onPress: () => props.navigation.navigate("Profiles", {}),
          },
        ]);
      })
      .catch((error) => {
        Alert.alert(
          "Somthing went wrong. Please check your internet connection."
        );
      });
  };

  const handleUpload = (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "employeesApp");
    data.append("cloud_name", "darshan07");

    fetch("https://api.cloudinary.com/v1_1/darshan07/image/upload", {
      method: "post",
      body: data,
    })
      .then((response) => response.json())
      .then((response2) => {
        //console.log(response2);
        setPicture(response2.url);
        setLoading(false);
        Alert.alert("Image uploaded successfully.");
      })
      .catch((error) => {
        Alert.alert(
          "Somthing went wrong. Please check your internet connection."
        );
      });
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      //console.log(result);
      if (!result.cancelled) {
        let newfile = {
          uri: result.uri,
          type: `filename/${result.uri.split(".")[1]}`,
          name: `filename.${result.uri.split(".")[1]}`,
        };
        setLoading(true);
        handleUpload(newfile);
      }
    } else {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
    }
  };

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      //console.log(result);
      if (!result.cancelled) {
        let newfile = {
          uri: result.uri,
          type: `filename/${result.uri.split(".")[1]}`,
          name: `filename.${result.uri.split(".")[1]}`,
        };

        setLoading(true);
        handleUpload(newfile);
      }
    } else {
      Alert.alert("Sorry, we need camera permissions to make this work!");
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
    <View style={styles.root}>
      {/* <KeyboardAvoidingView behavior="position"> */}
      <StatusBar backgroundColor="black" />
      <Appbar.Header
        style={{ height: "5%" }}
        theme={{ colors: { primary: "#0384fc" } }}
      >
        <Appbar.BackAction
          onPress={() => props.navigation.navigate("Profiles")}
        />
        <Appbar.Content
          title={props.route.params?.name ? "Update Profile" : "Create Profile"}
          style={{
            justifyContent: "center",
            //alignItems: "center",
            height: "2%",
            marginLeft: "15%",
          }}
        />
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
          <Title style={{ margin: 10 }}>Uploading...</Title>
        </View>
      ) : (
        <ScrollView>
          <TextInput
            autoCompleteType="name"
            placeholder="Enter name"
            style={styles.inputs}
            theme={inputsTheme}
            mode="outlined"
            label="Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            autoCompleteType="email"
            placeholder="abc@example.xyz"
            style={styles.inputs}
            theme={inputsTheme}
            mode="outlined"
            label="E-mail"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            placeholder="Enter your position"
            style={styles.inputs}
            theme={inputsTheme}
            mode="outlined"
            label="Post"
            keyboardType="default"
            value={post}
            onChangeText={(text) => setPost(text)}
          />
          <TextInput
            autoCompleteType="tel"
            placeholder="Enter 10 digits mobile no."
            style={styles.inputs}
            theme={inputsTheme}
            mode="outlined"
            label="Contact No."
            keyboardType="number-pad"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
            }}
            // render={(props) => (
            //   <TextInputMask {...props} mask={"+91 ([000]) [000] [00] [00]"} />
            // )}
          />
          <TextInput
            placeholder="Enter salary"
            style={styles.inputs}
            theme={inputsTheme}
            mode="outlined"
            label="Salary"
            keyboardType="visible-password"
            value={salary}
            onChangeText={(text) => setSalary(text)}
          />

          <TouchableOpacity
            onPress={() => {
              if (checkConnectivity()) {
                setModal(true);
              }
            }}
          >
            <Button
              style={{ margin: 20, marginHorizontal: "20%" }}
              icon={picture === defaultPicture ? "upload" : "check"}
              mode={picture === defaultPicture ? "contained" : "outlined"}
              theme={inputsTheme}
            >
              {picture === defaultPicture ? "upload image" : "edit image"}
            </Button>
          </TouchableOpacity>

          {props.route.params?.name ? (
            <TouchableOpacity
              onPress={() => {
                if (checkConnectivity()) {
                  setLoading(true);
                  updateDetails();
                }
              }}
            >
              <Button
                style={{ marginHorizontal: "20%", marginBottom: "5%" }}
                icon="content-save"
                mode="contained"
                theme={inputsTheme}
              >
                update
              </Button>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (
                  name === null ||
                  email === null ||
                  post === null ||
                  phone === null ||
                  salary === null
                ) {
                  Alert.alert("All fields are required.");
                } else {
                  if (checkConnectivity()) {
                    setLoading(true);
                    submitData();
                  }
                }
              }}
            >
              <Button
                style={{ marginHorizontal: "20%", marginBottom: "5%" }}
                icon="content-save"
                mode="contained"
                theme={inputsTheme}
              >
                Save
              </Button>
            </TouchableOpacity>
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modal}
            onRequestClose={() => {
              setModal(false);
            }}
          >
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginTop: 20,
                }}
              >
                <Button
                  icon="camera"
                  mode="contained"
                  theme={inputsTheme}
                  onPress={() => {
                    setModal(false);
                    pickImageFromCamera();
                  }}
                >
                  camera
                </Button>
                <Button
                  icon="image-area"
                  mode="contained"
                  theme={inputsTheme}
                  onPress={() => {
                    setModal(false);
                    pickImageFromGallery();
                  }}
                >
                  gallery
                </Button>
              </View>
              <Button
                style={{ margin: 20, marginHorizontal: "20%" }}
                icon="cancel"
                theme={inputsTheme}
                onPress={() => setModal(false)}
              >
                Cancel
              </Button>
            </View>
          </Modal>
        </ScrollView>
      )}

      {/* </KeyboardAvoidingView> */}
    </View>
  );
};

const inputsTheme = { colors: { primary: "#0384fc" } };

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  inputs: {
    margin: 5,
  },
  modalView: {
    position: "absolute",
    bottom: 1,
    width: "100%",
    backgroundColor: "#f7fafa",
  },
});

export default CreateEmployee;
