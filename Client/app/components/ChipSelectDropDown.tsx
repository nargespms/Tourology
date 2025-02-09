import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";

interface ChipSelectDropDownProps {
  label: string;
  items: string[];
  selectedItems: string[];
  onSelectedItemsChange: (items: string[]) => void;
  placeholder?: string;
}

const ChipSelectDropDown: React.FC<ChipSelectDropDownProps> = ({
  label,
  items,
  selectedItems,
  onSelectedItemsChange,
  placeholder = "Select an item",
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<string>("");

  const handleAdd = () => {
    if (currentSelection && !selectedItems.includes(currentSelection)) {
      onSelectedItemsChange([...selectedItems, currentSelection]);
    }
  };

  const handleRemove = (item: string) => {
    const updated = selectedItems.filter((i) => i !== item);
    onSelectedItemsChange(updated);
  };

  const handleSelect = (item: string) => {
    setCurrentSelection(item);
    setModalVisible(false);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inlineContainer}>
        <TouchableOpacity
          style={[styles.dropdownButton, { flex: 4, marginRight: 8 }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: currentSelection ? "#333" : "#999" }}>
            {currentSelection || placeholder}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addButton, { flex: 1 }]}
          onPress={handleAdd}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chipContainer}>
        {selectedItems.map((item) => (
          <View key={item} style={styles.chip}>
            <Text style={styles.chipText}>{item}</Text>
            <TouchableOpacity onPress={() => handleRemove(item)}>
              <Text style={styles.chipRemove}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={items}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ChipSelectDropDown;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  inlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    height: 50,
    borderRadius: 4,
    paddingHorizontal: 12,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  dropdownArrow: {
    color: "#666",
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: "#ccc",
    height: 50,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#000",
    fontSize: 14,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: "#333",
    marginRight: 6,
  },
  chipRemove: {
    color: "#777",
    fontWeight: "bold",
    marginLeft: 4,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 4,
    width: "80%",
    maxHeight: "50%",
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
});
