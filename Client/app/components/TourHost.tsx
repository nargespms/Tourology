import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getAvatar } from "../api/media";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTourGuideInfo, followTourGuide } from "../api/users";
import { pluralize } from "../utils/formats";
import { useNavigation } from "@react-navigation/native";

interface TourHostProps {
  name: string;
  id: string;
}

const TourHost: React.FC<TourHostProps> = (tourGuide) => {
  const [isFollowing, setIsFollowing] = React.useState(false);
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { isFetching, data: complementaryTourGuide } = useQuery({
    queryKey: ["tourGuide", tourGuide.id],
    queryFn: () => getTourGuideInfo(tourGuide.id),
  });

  useEffect(() => {
    if (complementaryTourGuide) {
      setIsFollowing(complementaryTourGuide.followed);
    }
  }, [complementaryTourGuide]);

  const { mutate } = useMutation({
    mutationFn: () => followTourGuide(tourGuide.id, isFollowing),
    onSuccess: () => {
      Alert.alert(
        `You are now ${!isFollowing ? "following" : "unfollowing"} ${
          tourGuide.name
        }`
      );

      setIsFollowing(!isFollowing);
      queryClient.invalidateQueries({
        queryKey: ["tours"],
      });
    },
  });

  const handleFollow = () => {
    mutate();
  };

  const handleProfileView = () => {
    navigation.navigate("TourGuideProfile" as never, {
      complementaryTourGuide,
    });
  };

  return (
    <View style={styles.guideContainer}>
      <TouchableOpacity
        onPress={handleProfileView}
        style={{ display: "flex", flexDirection: "row", flexShrink: 1 }}
      >
        <Image
          source={{ uri: getAvatar(tourGuide.id) }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.guideName}>Hosted by {tourGuide.name}</Text>
          {isFetching && <Text style={styles.experience}>...</Text>}
          {!isFetching && complementaryTourGuide && (
            <Text style={styles.experience}>
              {pluralize(complementaryTourGuide.yearsOfExperience || 1, "year")}{" "}
              of experience
            </Text>
          )}
        </View>
      </TouchableOpacity>
      {complementaryTourGuide && (
        <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
          {!isFollowing ? (
            <Text style={styles.followButtonText}>Follow</Text>
          ) : (
            <Text style={styles.followButtonText}>Following</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  guideContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  guideName: {
    fontWeight: "600",
    marginBottom: 2,
  },
  experience: {
    fontSize: 12,
    color: "#777",
  },
  followButton: {
    borderWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  followButtonText: {
    fontWeight: "600",
    color: "#000",
  },
});

export default TourHost;
