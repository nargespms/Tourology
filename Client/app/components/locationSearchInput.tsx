import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface NominatePlace {
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  onLocationSelect: (lat: number, lon: number, displayName: string) => void;
  error?: boolean;
  selectedLocation?: {
    coordinates: number[];
    displayName: string;
  };
}

export default function LocationSearchInput({
  onLocationSelect,
  error,
  selectedLocation,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatePlace[]>([]);
  const [loading, setLoading] = useState(false);
  const isSelectionMade = useRef(false); // Use ref instead of state to avoid re-renders
  const timeoutId = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear previous timeout
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    if (!query) {
      setResults([]);
      return;
    }

    // Skip search if selection was just made
    if (isSelectionMade.current) {
      return;
    }

    // Debounce or small delay to reduce spamming the API
    timeoutId.current = setTimeout(() => {
      fetchPlaces(query);
    }, 500);

    return () => {
      // Cleanup timeout on unmount or when query changes
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
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

  const handleSelect = ({ lat, lon, display_name }) => {
    // Convert lat/lon to numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    // Set flag to prevent re-search
    isSelectionMade.current = true;
    onLocationSelect(latitude, longitude, display_name);
    // Clear results
    setResults([]);
    // Set query to display_name
    setQuery(display_name);
  };

  useEffect(() => {
    if (selectedLocation?.displayName) {
      isSelectionMade.current = true;
      setQuery(selectedLocation?.displayName);
      handleSelect({
        lat: selectedLocation.coordinates[1],
        lon: selectedLocation.coordinates[0],
        display_name: selectedLocation.displayName,
      });
    }
  }, [selectedLocation?.displayName]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    isSelectionMade.current = false;
  };

  const handleChangeText = (text: string) => {
    if (text !== query) {
      isSelectionMade.current = false;
      setQuery(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, error && styles.errorInput]}>
        <Text>{error}</Text>
        <TextInput
          style={styles.input}
          placeholder="Search city..."
          placeholderTextColor={"#999"}
          value={query}
          onChangeText={handleChangeText}
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
            scrollEnabled={false} // for preventing error inside scrollview
            keyExtractor={(item, index) => index.toString()}
            style={styles.list}
            renderItem={({ item }) => (
              <View key={item.display_name}>
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
    borderRadius: 6,
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
    borderRadius: 6,
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
  errorInput: {
    borderColor: "red",
  },
});
