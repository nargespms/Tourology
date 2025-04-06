import { ActivityIndicator, Image, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getAvatar } from "../api/media";

interface Location {
  latitude: number;
  longitude: number;
}

interface Participant {
  id: string;
  _id: string;
  name: string;
  phoneNumber: string;
  distance: string;
  location: Location;
  checkedIn: boolean;
}

interface TrackingMapProps {
  guideLocation: Location;
  participants?: Participant[]; // For Tour Guide's view
  travelerLocation?: Location; // For Traveler's view
  tourGuideId?: string;
  travelerId?: string;
  attendees?: any;
}

const TrackingMap: React.FC<TrackingMapProps> = ({
  guideLocation,
  participants,
  travelerLocation,
  tourGuideId,
  travelerId,
  attendees,
}) => {
  const initialRegion = {
    latitude: guideLocation?.latitude || 37.78825,
    longitude: guideLocation?.longitude || -122.4324,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  };

  const locationIsNotSet = !!!guideLocation;

  return (
    <View style={{ flex: 1 }}>
      {locationIsNotSet && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* loading */}
          <ActivityIndicator
            size="small"
            color="#007AFF"
            style={{ paddingVertical: 10 }}
          />
          <Text style={{ fontSize: 16, color: "#333" }}>
            Waiting for the tour guide location...
          </Text>
        </View>
      )}

      {!locationIsNotSet && (
        <MapView
          style={{ flex: 1, borderRadius: 8 }}
          initialRegion={initialRegion}
        >
          <Marker
            coordinate={{
              latitude: guideLocation.latitude,
              longitude: guideLocation.longitude,
            }}
            title="Tour Guide"
            description="Current guide location"
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={{ uri: getAvatar(tourGuideId) }}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: "#fff",
                }}
              />
            </View>
          </Marker>

          {participants?.map(
            ({ location, id, name }, index) =>
              location && (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  pinColor="green"
                >
                  <View style={{ alignItems: "center" }}>
                    <Image
                      source={{ uri: getAvatar(id) }}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: "#fff",
                      }}
                    />
                  </View>
                </Marker>
              )
          )}

          {travelerLocation && (
            <Marker
              coordinate={{
                latitude: travelerLocation.latitude,
                longitude: travelerLocation.longitude,
              }}
              pinColor="green"
              title="You"
            >
              <View style={{ alignItems: "center" }}>
                <Image
                  source={{ uri: getAvatar(travelerId) }}
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: "#fff",
                  }}
                />
              </View>
            </Marker>
          )}
        </MapView>
      )}
    </View>
  );
};

export default TrackingMap;
