import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onSearch?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search",
  onSearch,
  onFocus,
  onBlur,
  value: searchText = "",
}) => {
  const handleSearch = (text: string) => {
    onSearch?.(text);
  };

  const handleClear = () => {
    onSearch?.("");
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={20}
        color="#777"
        style={styles.iconLeft}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        onBlur={() => {
          if (searchText.length === 0) onBlur?.();
        }}
        placeholderTextColor="#999"
        value={searchText}
        onFocus={onFocus}
        onChangeText={handleSearch}
      />
      {searchText.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close-outline" size={22} color="#777" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  iconLeft: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    marginLeft: 8,
  },
});
