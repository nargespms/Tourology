import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

type PickerButtonProps = {
  options: string[];
  activeOption: string;
  onSelect: (option: string) => void;
};

const PickerButton: React.FC<PickerButtonProps> = ({
  options,
  activeOption,
  onSelect,
}) => {
  return (
    <View>
      <TouchableOpacity style={styles.container}>
        <View style={styles.pickerRow}>
          {options.map((option) => (
            <TouchableOpacity
              onPress={() => onSelect(option)}
              style={[
                styles.pickerButton,
                activeOption === option && styles.pickerButtonActive,
              ]}
            >
              <Text
                style={{
                  color: activeOption === option ? "#fff" : "#8C8C8C",
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerRow: {
    flexDirection: "row",
    marginTop: 4,
    backgroundColor: "#EBEBEB",
    padding: 5,
    borderRadius: 4,
  },
  pickerButton: {
    flex: 1,
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
    color: "#fff",
  },
  pickerButtonActive: {
    backgroundColor: "#000",
  },
  buttonRow: {
    flexDirection: "row",
    marginVertical: 20,
  },
});

export default PickerButton;
