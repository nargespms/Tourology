import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NavItem } from "../data/navbarOptions";

type BottomNavBarProps = {
  items: NavItem[];
  currentTab: string;
  onTabPress: (tabName: string) => void;
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({
  items,
  currentTab,
  onTabPress,
}) => {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={styles.tabButton}
          onPress={() => onTabPress(item.label)}
        >
          <Ionicons
            name={item.icon}
            size={24}
            color={
              currentTab === item.label
                ? "#4285F4"
                : !item.enable
                ? "#bebebe"
                : "#777"
            }
          />
          <Text
            style={[
              styles.label,
              {
                color:
                  currentTab === item.label
                    ? "#4285F4"
                    : !item.enable
                    ? "#bebebe"
                    : "#777",
              },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNavBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    color: "#777",
  },
});
