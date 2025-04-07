import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import { tourCategories } from "../data/tours";
import CustomModal from "./CustomeModal";
import MultiSelectDropDown from "./MultiSelectDropDown";
import PickerButton from "./PickerButton";
import PriceRangeSlider from "./PriceRangeSlider";
import LocationSearchInput from "./locationSearchInput";

export type Filter = {
  pricingOption?: string;
  priceRange?: number[];
  rating?: number;
  date?: DateType;
  coordinates: number[];
  locationDisplayName?: string;
  selectedCategory?: string[];
};

interface AdvancedSearchOptionsProps {
  activeFilter: Filter;
  onSubmit: (filter: Filter) => void;
  onClose: () => void;
}

const AdvancedSearchOptions: React.FC<AdvancedSearchOptionsProps> = (props) => {
  const { onSubmit, onClose, activeFilter } = props;

  const [filter, setFilter] = useState(activeFilter ? activeFilter : null);
  const [pricingOption, setPricingOption] = useState<string>(
    activeFilter ? activeFilter?.pricingOption : "Paid"
  );
  const [priceRange, setPriceRange] = useState<number[]>(
    activeFilter ? activeFilter?.priceRange : [10, 500]
  );
  const [isDatePickerEnable, setIsDatePickerEnable] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(
    activeFilter ? activeFilter?.rating : undefined
  );
  const [date, setDate] = useState<DateType>(
    activeFilter ? activeFilter.date : undefined
  );

  const [selectedCategory, setSelectedCategory] = useState<string[]>(
    activeFilter ? activeFilter.selectedCategory : []
  );

  const [coordinates, setCoordinates] = useState<number[]>([]);
  const [locationDisplayName, setLocationDisplayName] = useState<string>("");

  const handleLocationSelect = (
    lat: number,
    lon: number,
    displayName: string
  ) => {
    setCoordinates([lon, lat]);
    setLocationDisplayName(displayName);
  };

  useEffect(() => {
    setFilter({
      pricingOption,
      priceRange: pricingOption === "Free" ? [] : priceRange,
      rating,
      date,
      selectedCategory,
      coordinates,
      locationDisplayName,
    });
  }, [
    pricingOption,
    rating,
    date,
    priceRange,
    selectedCategory,
    coordinates,
    locationDisplayName,
  ]);

  useEffect(() => {
    if (
      pricingOption === "Paid" &&
      activeFilter?.priceRange.length === 0 &&
      priceRange.length === 0
    ) {
      setPriceRange([10, 500]);
    }
  }, [pricingOption]);

  const clearFilters = () => {
    setPricingOption("Paid");
    setPriceRange([10, 500]);
    setRating(undefined);
    setDate(undefined);
    setSelectedCategory([]);
    setFilter(null);
    setCoordinates([]);
    setLocationDisplayName("");
  };

  return (
    <View style={styles.advancedFilterWrapper}>
      <View style={styles.filterCloseWrap}>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* location */}
        <View style={styles.locationStyles}>
          <Text style={[styles.locationText, styles.filterTitle]}>
            Location
          </Text>
          <View
            style={{
              flexGrow: 1,
              marginLeft: 18,

              flexShrink: 1,
            }}
          >
            <LocationSearchInput
              selectedLocation={{
                coordinates: activeFilter?.coordinates,
                displayName: activeFilter?.locationDisplayName,
              }}
              onLocationSelect={(lat, lon, displayName) => {
                handleLocationSelect(lat, lon, displayName);
              }}
            />
          </View>
        </View>

        {/* Rating */}
        <View style={styles.ratingStyles}>
          <Text style={styles.filterTitle}>Rating</Text>
          <View style={styles.ratingOptions}>
            {[4, 3].map((rate) => (
              <TouchableOpacity
                key={rate}
                style={[
                  styles.ratingTag,
                  rating === rate && styles.ratingTagSelected,
                ]}
                onPress={() => {
                  if (rating === rate) {
                    setRating(undefined); // toggle off
                  } else {
                    setRating(rate); // toggle on
                  }
                }}
              >
                <Text
                  style={[
                    styles.ratingTagText,
                    rating === rate && styles.ratingTagTextSelected,
                  ]}
                >
                  {"★".repeat(rate) + "☆".repeat(5 - rate)} & up
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* date */}
        {pricingOption === "Paid" && (
          <View style={styles.startDateStyles}>
            <Text style={styles.filterTitle}>Date</Text>

            <View
              style={[
                styles.input,
                {
                  flexGrow: 1,
                  marginLeft: 48,
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
            >
              <TouchableOpacity onPress={() => setIsDatePickerEnable(true)}>
                {date && (
                  <Text>{dayjs(date).locale("en").format("MMM DD, YYYY")}</Text>
                )}
                {!date && <Text style={{ color: "#999" }}>Select date </Text>}
              </TouchableOpacity>
              {date && (
                <TouchableOpacity
                  onPress={() => setDate(undefined)}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-outline" size={22} color="#777" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* tourGuide expertise */}

        <View style={[styles.tourCategoryStyles]}>
          <Text style={[styles.filterTitle]}>Category</Text>
          <View
            style={{
              flexGrow: 1,
              flexShrink: 1,
              marginLeft: 16,
            }}
          >
            <MultiSelectDropDown
              options={tourCategories}
              selectedOptions={selectedCategory}
              onSelect={(option) => {
                setSelectedCategory((prev) => {
                  const updated = [...prev, option];
                  setFilter((f) => ({ ...f, selectedCategory: updated }));
                  return updated;
                });
              }}
              onRemove={(option) => {
                setSelectedCategory((prev) => {
                  const updated = prev.filter((item) => item !== option);
                  setFilter((f) => ({ ...f, selectedCategory: updated }));
                  return updated;
                });
              }}
            />
          </View>
        </View>

        {/* pricing */}
        <View style={styles.pricingStyles}>
          <Text style={styles.filterTitle}>Pricing</Text>

          <View style={{ flexGrow: 1, marginLeft: 12 }}>
            <PickerButton
              customStyle={{
                paddingLeft: 18,
              }}
              options={["Paid", "Free"]}
              activeOption={pricingOption}
              onSelect={(option) => setPricingOption(option)}
            />
          </View>
        </View>

        {pricingOption === "Paid" && (
          <View style={{ marginTop: 16 }}>
            <PriceRangeSlider
              priceRange={priceRange}
              onChange={(priceRange) => setPriceRange(priceRange)}
            />
          </View>
        )}
      </ScrollView>

      {/* modal for date Picker */}
      <CustomModal
        visible={isDatePickerEnable}
        onClose={() => setIsDatePickerEnable(false)}
      >
        <View>
          <DateTimePicker
            mode="single"
            selectedItemColor={"#000000"}
            date={date}
            onChange={({ date }) => {
              setDate(date);
            }}
          />
          <View>
            <Text style={{ marginVertical: 12 }}>
              <Text style={{ fontWeight: 700 }}>Selected date: </Text>
              {dayjs(date).locale("en").format("MMM DD, YYYY")}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              padding: 16,
            }}
          >
            <TouchableOpacity
              style={styles.draftButton}
              onPress={() => {
                setIsDatePickerEnable(false);
                setDate(undefined);
              }}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setIsDatePickerEnable(false);
                setDate(date);
              }}
            >
              <Text style={{ color: "#fff" }}>Set</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>

      {/* Sticky bottom action bar */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.draftButton} onPress={clearFilters}>
          <Text>Clear Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => onSubmit(filter)}
        >
          <Text style={{ color: "#fff" }}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdvancedSearchOptions;

const styles = StyleSheet.create({
  advancedFilterWrapper: {
    height: 600,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  filterTitle: {
    fontWeight: "bold",
    fontSize: 15,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filterCloseWrap: {
    width: "100%",
    padding: 8,
    marginBottom: 22,
  },
  locationStyles: {
    flexDirection: "row",
    textAlign: "center",
  },
  locationText: {
    alignSelf: "center",
  },
  startDateStyles: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  pricingStyles: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 25,
    width: "100%",
  },
  //   rating
  ratingOptions: {
    flexDirection: "row",
    gap: 10,
  },
  ratingStyles: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingTag: {
    backgroundColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  ratingTagSelected: {
    backgroundColor: "#000",
    borderColor: "#000",
  },

  ratingTagTextSelected: {
    color: "#fff",
  },

  ratingTagText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
  },

  tourCategoryStyles: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 25,
  },
  // Sticky bottom button container
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  draftButton: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 14,
    borderRadius: 6,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 6,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
