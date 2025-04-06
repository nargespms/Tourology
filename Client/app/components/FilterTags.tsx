import { StyleSheet, Text, View } from "react-native";
import { Filter } from "./AdvancedSearchOptions";
import dayjs from "dayjs";

interface FilterTagsProps {
  filter: Filter;
}

const FilterTags: React.FC<FilterTagsProps> = ({ filter }) => {
  return (
    <View style={styles.filterTagsWrapper}>
      <Text style={styles.filterLabel}>Filter:</Text>

      {/* Rating tag */}
      {filter?.rating && (
        <View style={styles.filterTag}>
          <Text style={styles.filterTagText}>{`★ ${filter.rating} & up`}</Text>
        </View>
      )}

      {/* Pricing */}
      {filter?.pricingOption && (
        <View style={styles.filterTag}>
          <Text style={styles.filterTagText}>{filter?.pricingOption}</Text>
        </View>
      )}

      {/* Price Range */}
      {filter?.priceRange?.length === 2 && (
        <View style={styles.filterTag}>
          <Text style={styles.filterTagText}>
            ${filter?.priceRange[0]} - ${filter?.priceRange[1]}
          </Text>
        </View>
      )}

      {/* Date */}
      {filter?.date && (
        <View style={styles.filterTag}>
          <Text style={styles.filterTagText}>
            Date: {dayjs(filter?.date).format("MMM D, YYYY")}
          </Text>
        </View>
      )}

      {filter?.locationDisplayName && (
        <View style={styles.filterTag}>
          <Text style={styles.filterTagText}>
            {filter?.locationDisplayName}
          </Text>
        </View>
      )}

      {/* Expertise/Category */}
      {"selectedCategory" in filter &&
        filter?.selectedCategory?.map((item) => (
          <View style={styles.filterTag} key={item}>
            <Text style={styles.filterTagText}>{item}</Text>
          </View>
        ))}
    </View>
  );
};
export default FilterTags;

const styles = StyleSheet.create({
  filterTagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 8,
    marginVertical: 10,
  },

  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  filterTag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },

  filterTagText: {
    fontSize: 13,
    color: "#333",
  },
});
