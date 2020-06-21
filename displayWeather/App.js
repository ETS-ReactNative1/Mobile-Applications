import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import SelectCity from "./components/SelectCityScreen";
import SearchedCity from "./components/SearchedCityScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "SearchedCity") {
              iconName = "md-cloud";
            } else if (route.name === "SelectCity") {
              iconName = "ios-list-box";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "white",
          inactiveTintColor: "#bbb",
          activeBackgroundColor: "#6200ee",
          inactiveBackgroundColor: "#6200ee",
        }}
      >
        <Tab.Screen
          name="SearchedCity"
          component={SearchedCity}
          initialParams={{ city: "London" }}
          options={{ title: "Weather" }}
        />
        <Tab.Screen
          name="SelectCity"
          component={SelectCity}
          options={{ title: "Select City" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
