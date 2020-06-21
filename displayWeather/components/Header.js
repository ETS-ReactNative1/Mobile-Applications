import React from "react";
import { View } from "react-native";
import { Appbar } from "react-native-paper";

export default function Header(props) {
  return (
    <View>
      <Appbar.Header>
        <Appbar.Content
          style={{ alignItems: "center" }}
          title="Weather Report"
          subtitle={props.subtitle}
        />
      </Appbar.Header>
    </View>
  );
}
