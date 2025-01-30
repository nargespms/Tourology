import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

interface TourHostProps {
  tourGuide: {
    name: string;
    experience?: number;
    avatar?: string;
  };
}

const TourHost: React.FC<TourHostProps> = ({ tourGuide }) => {
  const [isFollowing, setIsFollowing] = React.useState(false);

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    Alert.alert("Follow", "You are now following this guide!");
  };

  return (
    <View style={styles.guideContainer}>
      <Image
        source={require("../../assets/avatar.png")}
        style={styles.avatar}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.guideName}>Hosted by {tourGuide.name}</Text>
        <Text style={styles.experience}>
          {tourGuide.experience}years of experience
        </Text>
      </View>
      <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
        {isFollowing ? (
          <Text style={styles.followButtonText}>Follow</Text>
        ) : (
          <Text style={styles.followButtonText}>Following</Text>
        )}
      </TouchableOpacity>
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
