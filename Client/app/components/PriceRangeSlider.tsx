import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PriceMarker from "./PriceMarker";

interface PriceRangeSliderProps {
  priceRange?: number[];
  onChange: (priceRange: number[]) => void;
}
const PriceRangeSlider: React.FC<PriceRangeSliderProps> = (props) => {
  const { onChange, priceRange } = props;

  return (
    <View style={styles.container}>
      <View style={styles.priceRangeSection}>
        <Text style={[styles.filterLabel, { alignSelf: "flex-start" }]}>
          Price range
        </Text>
        <View style={{ alignItems: "center" }}>
          <MultiSlider
            values={priceRange ? priceRange : [10, 500]}
            min={0}
            max={500}
            step={1}
            onValuesChange={(values) => {
              onChange(values);
            }}
            selectedStyle={{ backgroundColor: "#000" }}
            customMarker={(e) => <PriceMarker currentValue={e.currentValue} />}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  priceRangeSection: {
    width: "100%",
  },
  filterLabel: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 12,
    textAlign: "left",
  },

  histogram: {
    height: 60,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: "center",
  },
});

export default PriceRangeSlider;
