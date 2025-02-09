import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type TabItem = {
  label: string;
  value: string;
};

type CustomTabsProps = {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (value: string) => void;
};

const CustomTabs: React.FC<CustomTabsProps> = ({
  tabs,
  activeTab,
  onTabPress,
}) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.value}
          style={styles.tabButton}
          onPress={() => onTabPress(tab.value)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.value && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
          {activeTab === tab.value && <View style={styles.underline} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CustomTabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 20,
    marginBottom: 10,
  },
  tabButton: {
    marginRight: 24,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "bold",
  },
  underline: {
    marginTop: 4,
    marginBottom: 8,
    height: 3,
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 2,
  },
});
