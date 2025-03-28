import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface MultiSelectDropDownProps {
  options: string[];
  selectedOptions: string[];
  onSelect: (option: string) => void;
  onRemove: (option: string) => void;
}

const MultiSelectDropDown: React.FC<MultiSelectDropDownProps> = ({
  options,
  selectedOptions,
  onSelect,
  onRemove,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleOption = (option: string) => {
    selectedOptions.includes(option) ? onRemove(option) : onSelect(option);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => dropdownOpen && setDropdownOpen(false)}
    >
      <View style={styles.filterBlock}>
        <TouchableOpacity
          style={styles.dropdownSelector}
          onPress={() => setDropdownOpen((prev) => !prev)}
        >
          <Text style={styles.dropdownText}>
            {selectedOptions.length > 0
              ? selectedOptions.join(", ")
              : "Select expertise..."}
          </Text>
          <Ionicons
            name={dropdownOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color="#444"
          />
        </TouchableOpacity>

        {dropdownOpen && (
          <View style={styles.dropdownList}>
            {options.map((option) => {
              const isSelected = selectedOptions.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.dropdownItem,
                    isSelected && styles.dropdownItemSelected,
                  ]}
                  onPress={() => toggleOption(option)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      isSelected && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MultiSelectDropDown;

const styles = StyleSheet.create({
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  dropdownText: {
    fontSize: 14,
    color: "#444",
  },

  dropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingVertical: 4,
  },

  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  dropdownItemSelected: {
    backgroundColor: "#e6f0ff",
  },

  dropdownItemText: {
    fontSize: 14,
    color: "#333",
  },

  dropdownItemTextSelected: {
    fontWeight: "bold",
    color: "#0057d9",
  },
  dropdownSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
});
