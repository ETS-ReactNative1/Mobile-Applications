import React, { useEffect, useContext, useState } from "react";
import { View, AsyncStorage } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { AuthContext } from "../App";

export default function LoadingScreen(props) {
  const { setLoggedIn } = useContext(AuthContext);
  const detectLogin = async () => {
    const token = await AsyncStorage.getItem("EmployeesAppToken");
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  };
  useEffect(() => {
    detectLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator animating={true} color="#0384fc" size="large" />
      <Text style={{ margin: 10 }}>Loading...</Text>
    </View>
  );
}
