import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface NominatimPlace {
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  onLocationSelect: (lat: number, lon: number, displayName: string) => void;
}

export default function LocationSearchInput({ onLocationSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimPlace[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    // Debounce or small delay to reduce spamming the API
    const delayId = setTimeout(() => {
      fetchPlaces(query);
    }, 500);

    return () => clearTimeout(delayId);
  }, [query]);

  const fetchPlaces = async (searchText: string) => {
    try {
      setLoading(true);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchText
      )}&addressdetails=1&limit=5`;
      const response = await fetch(url);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.warn("Nominatim fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (place: NominatimPlace) => {
    // Convert lat/lon to numbers
    const latitude = parseFloat(place.lat);
    const longitude = parseFloat(place.lon);

    onLocationSelect(latitude, longitude, place.display_name);
    // Optionally clear results
    setResults([]);
    // Optionally set query to place.display_name
    setQuery(place.display_name);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search city..."
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-outline" size={22} color="#777" />
          </TouchableOpacity>
        )}
      </View>
      {loading && <ActivityIndicator style={{ marginVertical: 6 }} />}
      <View>
        {results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={(item, index) => index.toString()}
            style={styles.list}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  key={item.display_name}
                  onPress={() => handleSelect(item)}
                  style={styles.listItem}
                >
                  <Text>{item.display_name}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 999,
    width: "100%",
    backgroundColor: "#fff",
  },

  list: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    maxHeight: 200,
  },
  listItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  clearButton: {
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  iconLeft: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});
