import React from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import DisplayResult from "./components/displayComponent";
import {
  ActivityIndicator,
  Colors,
  Appbar,
  TextInput,
  Button,
} from "react-native-paper";

export default class App extends React.Component {
  state = {
    fname: "",
    secname: "",
    output: "",
  };

  handle() {
    this.setState({
      output: "Loading...",
    });
    fetch(
      `https://love-calculator.p.rapidapi.com/getPercentage?fname=${this.state.fname}&sname=${this.state.secname}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "love-calculator.p.rapidapi.com",
          "x-rapidapi-key":
            "3bca5a10d7mshd7b04db1480985ep18cca1jsnbd5d6bc41410",
        },
      }
    )
      .then((response1) => {
        return response1.json();
      })
      .then((response2) => {
        this.setState({
          output: response2,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="transparent" backgroundColor="#6200ee" />
        <Appbar.Header
          dark={true}
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "4%",
          }}
        >
          <Appbar.Content
            title="Love % Calculator"
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </Appbar.Header>

        <TextInput
          style={{ margin: 10 }}
          label="Enter 1st person name"
          value={this.state.fname}
          onChangeText={(fname) => this.setState({ fname: fname })}
        />

        <TextInput
          style={{ margin: 10 }}
          label="Enter 2nd person name"
          value={this.state.secname}
          onChangeText={(secname) => this.setState({ secname })}
        />

        <Button
          style={{ margin: 30 }}
          icon="face"
          mode="contained"
          onPress={this.handle.bind(this)}
        >
          Calculate
        </Button>

        <DisplayResult output={this.state.output} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
