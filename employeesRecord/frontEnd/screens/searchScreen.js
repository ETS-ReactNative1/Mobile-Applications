import React, { useState } from "react";
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { Card, Title, Searchbar, Avatar, Paragraph } from "react-native-paper";

export default function SearchScreen(props) {
  const { mycards } = props.route.params;

  const [searchQuery, setSearchQuery] = useState("");
  const [cards, setCards] = useState(mycards);
  const [filteredCards, setFilteredCards] = useState(cards);

  const handleSuggestions = (text) => {
    setSearchQuery(() => text);
    const filters = cards.filter((card) => {
      return (
        card.name.toLowerCase().indexOf(text.toLowerCase()) > -1 ||
        card.post.toLowerCase().indexOf(text.toLowerCase()) > -1
      ); //******IMPORTANT*********//
    });
    setFilteredCards(filters);
  };

  const renderCards = (item) => {
    return (
      <TouchableOpacity
        onPress={() => {
          return props.navigation.replace("ViewProfile", {
            item,
            id: props.route.params.id,
          });
        }}
      >
        <Card
          style={{
            marginBottom: 5,
            elevation: 5,
            marginHorizontal: 3,
          }}
        >
          <Card.Content>
            <View style={{ flexDirection: "row" }}>
              <Avatar.Image
                size={70}
                source={{ uri: item.picture }}
                theme={{ colors: { primary: "#0384fc" } }}
              />
              <View style={{ marginHorizontal: 10, fontSize: 25 }}>
                <Title>{item.name}</Title>
                <Paragraph>{item.post}</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="black" />

      <Searchbar
        autoFocus={true}
        icon="arrow-left"
        style={{
          borderColor: "lightgray",
          borderWidth: 1,
          borderRadius: 5,
          marginHorizontal: 5,
          marginVertical: 10,
        }}
        placeholder="Search"
        onChangeText={(text) => handleSuggestions(text)}
        value={searchQuery}
        onIconPress={() => props.navigation.navigate("Profiles")}
      />

      <View style={{ flex: 1 }}>
        <FlatList
          keyboardShouldPersistTaps="handled" //******IMPORTANT*********//
          data={filteredCards}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return renderCards(item);
          }}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: "center" }}>No results found</Text>
          )}
        />
      </View>
    </View>
  );
}
