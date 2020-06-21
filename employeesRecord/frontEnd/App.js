import React, { useState, useEffect, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AsyncStorage } from "react-native";

import Profiles from "./screens/profiles";
import CreateEmployee from "./screens/createEmployee";
import ViewProfile from "./screens/viewProfile";
import YourAccount from "./screens/yourAccount";
import SearchScreen from "./screens/searchScreen";
import LoadingScreen from "./screens/LoadingScreen";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import MailScreen from "./screens/mailScreen";
import EnterEmailForPasswordReset from "./screens/enterEmailForPasswordReset";
import VerfiyPasswordResetCode from "./screens/verfiyPasswordResetCode";
import UpdatePassword from "./screens/updatePassword";

const baseURL = "https://employees-record-server.herokuapp.com/users/";
//const baseURL = "http://a0e489ffafaf.ngrok.io/users/"; // ngrok http PORT_NO

const AuthStack = createStackNavigator();
export function AuthStackScreens() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0384fc",
        },
        headerTintColor: "white",
        headerTitleAlign: "center",
      }}
    >
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
      <AuthStack.Screen
        name="MailScreen"
        component={MailScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="EnterEmailForPasswordReset"
        component={EnterEmailForPasswordReset}
        options={{ title: "Password-Reset" }}
      />
      <AuthStack.Screen
        name="VerfiyPasswordResetCode"
        component={VerfiyPasswordResetCode}
        options={{ title: "Password-Reset" }}
      />
      <AuthStack.Screen
        name="UpdatePassword"
        component={UpdatePassword}
        options={{ title: "Password-Reset" }}
      />
    </AuthStack.Navigator>
  );
}

const Stack = createStackNavigator();
export function MainScreens() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Profiles" component={Profiles} />
      <Stack.Screen name="CreateEmployee" component={CreateEmployee} />
      <Stack.Screen name="ViewProfile" component={ViewProfile} />
      <Stack.Screen name="YourAccount" component={YourAccount} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
    </Stack.Navigator>
  );
}

export const AuthContext = createContext();
export default function App() {
  const [isLoggedIn, setLoggedIn] = useState(null);

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
    <AuthContext.Provider
      value={{
        setLoggedIn: setLoggedIn,
        baseURL: baseURL,
      }}
    >
      <NavigationContainer>
        {isLoggedIn == null ? (
          <LoadingScreen />
        ) : isLoggedIn == true ? (
          <MainScreens />
        ) : (
          <AuthStackScreens />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
