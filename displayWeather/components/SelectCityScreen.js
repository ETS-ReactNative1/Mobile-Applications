import React, { useState } from "react";
import { View, ScrollView, AsyncStorage } from "react-native";
import { TextInput, Card, List } from "react-native-paper";

import Header from "./Header";

export default function SelectCity({ navigation }) {
  const [city, setCity] = useState();
  const [cities, setCities] = useState([]);
  let citiesList = [];

  function handleCity(city) {
    setCity(city);
    fetch(`http://autocomplete.wunderground.com/aq?query=${city}`)
      .then((response) => response.json())
      .then((data) => {
        setCities(data.RESULTS);
      })
      .catch((err) => {
        console.log(err);
      });
    //console.log(cities.slice(0, 2));
  }

  citiesList = (
    <Card style={{ margin: 5, elevation: 5+ }}>
      <List.Item title="No city selected" />
    </Card>
  );

  if (cities.length > 0) {
    citiesList = cities.map((obj) => {
      return (
        <Card
          style={{ margin: 5, elevation: 5 }}
          key={obj.l}
          onPress={async () => {
            setCity(obj.name);
            await AsyncStorage.setItem("newCity", obj.name);
            navigation.navigate("SearchedCity", { city: obj.name });
            console.log(city);
          }}
        >
          <List.Item title={obj.name} />
        </Card>
      );
    });
  }

  return (
    <View>
      <Header subtitle="Select City" />
      <TextInput
        style={{ margin: 5 }}
        mode="outlined"
        label="Enter city name"
        value={city}
        onChangeText={(text) => handleCity(text)}
        
      />

      <View style={{ marginBottom: 30, marginTop: 10 }}>
        <ScrollView>{citiesList}</ScrollView>
      </View>
    </View>
  );
}
