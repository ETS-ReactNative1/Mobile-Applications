import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const MyComponent = () => <ActivityIndicator animating={true} />;

const DisplayResult = (prop) => {
  if (prop.output.message) {
    return (
      <Text style={{ textAlign: "center" }}>Oops... Something went wrong.</Text>
    );
  }

  if (prop.output === "") {
    return <Text></Text>;
  } else if (prop.output === "Loading...") {
    return (
      <View>
        <Text style={{ textAlign: "center" }}>Loading...</Text>
        <MyComponent />
      </View>
    );
  } else {
    return (
      <View>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          Matching Percentage - {prop.output.percentage} %
        </Text>

        <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>
          {prop.output.result}
        </Text>
      </View>
    );
  }
};

export default DisplayResult;
