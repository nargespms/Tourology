import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAvatar } from "../api/media";
import { getHostTours } from "../api/tours";
import { followTourGuide, getTourGuideInfo } from "../api/users";
import BottomNavBar from "../components/BottomNavBar";
import CustomModal from "../components/CustomeModal";
import QRCodeScanner from "../components/QRCodeScanner";
import TourGuideTourList from "../components/TourGuideTourList";
import { useLoggedUser } from "../contexts/loggedUserData";
import { tourGuideNavbar, travelerNavbar } from "../data/navbarOptions";
import { capitalize } from "../utils/formats";

const TourGuideProfile: React.FC = () => {
  const [isQRModalVisible, setQRModalVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isTraveler, setIsTraveler] = useState(false);
  const { data: user } = useLoggedUser();

  const route = useRoute();
  const { complementaryTourGuide } = route.params;

  useEffect(() => {
    if (user.id === complementaryTourGuide.id) {
      setIsTraveler(false);
    } else {
      setIsTraveler(true);
    }
  }, [user.id, complementaryTourGuide.id]);

  const navigation = useNavigation();

  const handleBottomNavChange = (name: string) => {
    if (name === "check-ins") {
      setQRModalVisible(true);
    } else if (name === "Home" && !isTraveler) {
      navigation.navigate("TourGuideHome" as never);
    } else if (name === "Home" && isTraveler) {
      navigation.navigate("TravelerHome" as never);
    } else if (name === "Bookings") {
      navigation.navigate("TravelerBookings" as never);
    }
  };

  const onGoBackTap = () => {
    navigation.goBack();
  };

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
          complementaryTourGuide.firstName +
          " " +
          complementaryTourGuide.lastName
        }`
      );

      setIsFollowing(!isFollowing);
    },
  });

  const handleFollow = () => {
    mutate();
  };

  const { isFetching, data: tourGuide } = useQuery({
    queryKey: ["tourGuide", complementaryTourGuide.id],
    queryFn: () => getTourGuideInfo(complementaryTourGuide.id),
  });

  const {
    isLoading,
    data: allToursList,
    refetch,
    isFetched,
  } = useQuery({
    queryKey: ["hostTours"],
    queryFn: () => getHostTours(complementaryTourGuide.id),
  });

  const ownTours = allToursList?.filter(
    (tour) =>
      tour.state === "published" ||
      tour.state === "active" ||
      tour.state === "ended"
  );
  const totalReviews = ownTours.reduce((total, tour) => {
    const reviews = tour.reviews || {};
    const count = Object.keys(reviews).length;
    return total + count;
  }, 0);

  const averageRating = ownTours
    ?.reduce((acc, tour) => acc + (tour?.rating ? tour.rating : 0), 0)
    .toPrecision(2);

  if (isFetching) {
    return <Text>Loading...</Text>;
  }

  if (!tourGuide) {
    return <Text>No data found for this user.</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          source={require("../../assets/CoverPhoto.jpg")}
          style={styles.topImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={[styles.topButton, { left: 18 }]}
          onPress={() => onGoBackTap()}
        >
          <Text style={styles.topButtonText}>
            <Ionicons name="arrow-back" size={18} />
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ position: "relative" }}>
        <View style={styles.profilePicWrapper}>
          <Image
            source={{ uri: getAvatar(complementaryTourGuide.id) }}
            style={styles.avatar}
          />
        </View>

        <View style={styles.contentWrapper}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {tourGuide.profileName ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingBottom: 12,
                }}
              >
                <Text style={styles.profileName}>{tourGuide?.profileName}</Text>
                {tourGuide?.numberOfFollowers > 0 && (
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#2875e9",
                      paddingVertical: 4,
                    }}
                  >
                    {tourGuide?.numberOfFollowers} Followers
                  </Text>
                )}
              </View>
            ) : (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingBottom: 12,
                }}
              >
                <Text style={styles.profileName}>
                  {tourGuide?.firstName} {tourGuide?.lastName}
                </Text>
                {tourGuide?.numberOfFollowers > 0 && (
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#2875e9",
                      paddingVertical: 4,
                    }}
                  >
                    {tourGuide?.numberOfFollowers} Followers
                  </Text>
                )}
              </View>
            )}
            {isTraveler && (
              <View style={{ paddingBottom: 12 }}>
                {tourGuide && (
                  <TouchableOpacity
                    style={styles.followButton}
                    onPress={handleFollow}
                  >
                    {!isFollowing ? (
                      <Text style={styles.followButtonText}>Follow</Text>
                    ) : (
                      <Text style={styles.followButtonText}>Following</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <Text
                style={[
                  styles.profileBio,
                  tourGuide.bio
                    ? { marginTop: 8, marginBottom: 16 }
                    : { marginVertical: 0 },
                ]}
              >
                {tourGuide?.bio}
              </Text>

              {averageRating > 0 && (
                <View style={styles.ratingContainer}>
                  <View
                    style={[
                      {
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        alignItems: "center",
                        fontSize: 18,
                        fontWeight: "600",
                      }}
                    >
                      Average Rating
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.averageNumber}>{averageRating}</Text>
                      <Text style={styles.starRating}>
                        {`★`.repeat(Math.round(averageRating)) +
                          `☆`.repeat(5 - Math.round(averageRating))}{" "}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={{ fontSize: 12, color: "#656565" }}>
                      Based on {totalReviews} reviews.
                    </Text>
                  </View>
                </View>
              )}

              {(tourGuide?.yearsOfExperience ||
                tourGuide?.languages?.length > 0 ||
                tourGuide?.skills?.length > 0) && (
                <View style={styles.infoRow}>
                  {/* Experience */}
                  {tourGuide?.yearsOfExperience && (
                    <View style={styles.infoColumn}>
                      <Text style={styles.infoTitle}>Experience</Text>
                      <Text style={styles.infoValue}>
                        {tourGuide?.yearsOfExperience} years
                      </Text>
                    </View>
                  )}
                  {/* Divider */}
                  <View style={styles.verticalDivider} />

                  {/* Languages */}
                  {tourGuide?.languages?.length > 0 && (
                    <View style={styles.infoColumn}>
                      <Text style={styles.infoTitle}>Language(s)</Text>
                      <View style={styles.tagContainer}>
                        {tourGuide?.languages.map((lang: string) => (
                          <View key={lang} style={styles.tag}>
                            <Text style={styles.tagText}>
                              {lang.split(" ").map(capitalize).join(" ")}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                  {/* Divider */}
                  <View style={styles.verticalDivider} />

                  {/* Expertise */}
                  {tourGuide?.skills?.length > 0 && (
                    <View style={styles.infoColumn}>
                      <Text style={styles.infoTitle}>Expertise</Text>
                      <View style={styles.tagContainer}>
                        {tourGuide?.skills.map((skill: string) => (
                          <View key={skill} style={styles.tag}>
                            <Text style={styles.tagText}>
                              {skill.split(" ").map(capitalize).join(" ")}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              )}

              <View>
                <Text style={[styles.sectionTitle, { paddingTop: 20 }]}>
                  Tours
                </Text>
                <View>
                  {!isFetching && isFetched && ownTours && (
                    <FlatList
                      scrollEnabled={false}
                      data={Object.values(ownTours)}
                      keyExtractor={(tour) => tour._id}
                      renderItem={({ item }) => {
                        return (
                          <TourGuideTourList
                            key={item._id}
                            tour={item}
                            onPress={() =>
                              navigation.navigate("TravelerRouteDetails", {
                                tour: item,
                              })
                            }
                          />
                        );
                      }}
                      contentContainerStyle={styles.listContent}
                    />
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      <View style={styles.navbarWrapper}>
        <BottomNavBar
          items={isTraveler ? travelerNavbar : tourGuideNavbar}
          currentTab={!isTraveler ? "Profile" : ""}
          onTabPress={handleBottomNavChange}
        />
      </View>
      <CustomModal
        visible={isQRModalVisible}
        onClose={() => setQRModalVisible(false)}
      >
        <View style={styles.qrCodeScannerModal}>
          <Text style={styles.modalTitle}>Check-in</Text>
          <Text style={styles.modalSubtitle}>
            Scan the traveler’s QR code to check them in.
          </Text>
          <QRCodeScanner onScanSuccess={() => setQRModalVisible(false)} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setQRModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
    </SafeAreaView>
  );
};

export default TourGuideProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentWrapper: {
    paddingHorizontal: 20,
    marginTop: 60,
  },
  profileName: {
    marginTop: 0,
    fontSize: 22,
    fontWeight: "bold",
  },
  profileBio: {
    fontSize: 15,
    color: "#5d5d5d",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
  },
  qrCodeScannerModal: {
    minHeight: 500,
    padding: 8,
    paddingBottom: 50,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#222",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 6,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  navbarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  topImage: {
    width: "100%",
    height: 200,
  },
  topButton: {
    position: "absolute",
    top: 20,
    zIndex: 2,
    width: 32,
    height: 32,
    backgroundColor: "#fff",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  topButtonText: {
    color: "#393939",
    fontSize: 18,
  },
  profilePicWrapper: {
    borderRadius: 50,
    overflow: "hidden",
    marginRight: 16,
    position: "absolute",
    top: -60,
    left: 18,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: "100%",
    marginRight: 12,
  },
  listContent: {
    paddingBottom: 50,
    flexGrow: 1,
  },
  followButton: {
    borderWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    width: 100,
    alignItems: "center",
  },
  followButtonText: {
    fontWeight: "600",
    color: "#000",
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#383737",
  },

  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  tag: {
    backgroundColor: "#e6e6e6",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },

  tagText: {
    fontSize: 13,
    color: "#333",
  },
  scrollContent: {
    marginTop: 0,
    paddingBottom: 320,
  },

  nameRow: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    width: "100%",
  },

  averageNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    paddingRight: 8,
  },

  starRating: {
    fontSize: 18,
    color: "#f7b500",
    fontWeight: "600",
    letterSpacing: 2,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    gap: 8,
  },

  infoColumn: {
    flex: 1,
    alignItems: "flex-start",
    gap: 6,
    paddingHorizontal: 4,
  },

  verticalDivider: {
    width: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 6,
    borderRadius: 1,
  },
});
