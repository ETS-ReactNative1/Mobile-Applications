import React, { useEffect, useState, useMemo } from "react";
import { View, StyleSheet, Image, AsyncStorage, Alert } from "react-native";
import { Card, Title } from "react-native-paper";
import Header from "./Header";
import { LinearGradient } from "expo-linear-gradient";

export default function SearchedCity({ route }) {
  const [city, setCity] = useState("");
  const [humidity, setHumidity] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [maxTemp, setMaxTemp] = useState(0);
  const [minTemp, setMinTemp] = useState(0);
  const [description, setDescription] = useState("No Description Available");
  const [icon, setIcon] = useState("");
  const [windSpeed, setWindSpeed] = useState(0);

  async function handleWeather() {
    let mycity = await AsyncStorage.getItem("newCity");
    if (!mycity) {
      mycity = route.params?.city;
    }
    //let mycity = route.params?.city;
    // setCity((city) => route.params?.city);
    // console.log("city :" + city);
    // console.log(mycity);

    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${mycity}&units=metric&appid=bb781acc8e43305547ff52b076eee897`
    )
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        setCity(data.name);
        setHumidity(data.main.humidity);
        setPressure(data.main.pressure);
        setTemperature(data.main.temp);
        setMaxTemp(data.main.temp_max);
        setMinTemp(data.main.temp_min);
        setDescription(data.weather[0].description);
        setIcon(data.weather[0].icon);
        setWindSpeed(data.wind.speed);
      })
      // fetch(
      //   `https://community-open-weather-map.p.rapidapi.com/weather?units=metric&q=${mycity}`,
      //   {
      //     method: "GET",
      //     headers: {
      //       "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
      //       "x-rapidapi-key":
      //         "98d478cd70msh9cc4d7bdbdb4c74p1e71d9jsn50400a99b98a",
      //     },
      //   }
      // )
      //   .then((response) => response.json())
      //   .then((data) => {
      //     console.log(data);
      //     setCity(data.name);
      //     setHumidity(data.main.humidity);
      //     setPressure(data.main.pressure);
      //     setTemperature(data.main.temp);
      //     setMaxTemp(data.main.temp_max);
      //     setMinTemp(data.main.temp_min);
      //     setDescription(data.weather[0].description);
      //     setIcon(data.weather[0].icon);
      //     setWindSpeed(data.wind.speed);
      //   })
      .catch((err) => {
        Alert.alert("Unable to fetch the weather report for this city.");
      });
  }
  useEffect(() => {
    handleWeather();
  }, [route]);

  return (
    <View>
      <Header subtitle={city} />

      <Card
        style={{
          margin: 10,
        }}
      >
        <LinearGradient colors={["white", "#6200ee"]}>
          <View>
            <Title style={styles.title}>{city}</Title>
            <Image
              style={{
                height: 120,
                width: 120,
                alignSelf: "center",
              }}
              source={{
                uri: "http://openweathermap.org/img/w/" + icon + ".png",
              }}
            ></Image>
            <Title style={styles.title}>{description}</Title>
            <Title style={styles.title}>Temperature - '{temperature}' C</Title>
            <Title style={styles.title}>Pressure - '{pressure}' hPa</Title>
            <Title style={styles.title}>Humidity - '{humidity}%'</Title>
            <Title style={styles.title}>Max Temperature - '{maxTemp}' C</Title>
            <Title style={styles.title}>Min Temperature - '{minTemp}' C</Title>

            <Title style={styles.title}>
              Wind Speed : '{windSpeed}' meter/sec
            </Title>
          </View>
        </LinearGradient>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    padding: 10,
    color: "black",
  },
});
