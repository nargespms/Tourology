import { Image, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getAvatar } from "../api/media";

interface Location {
  latitude: number;
  longitude: number;
}

interface TrackingMapProps {
  guideLocation: Location;
  participantLocations?: Location[]; // For Tour Guide's view
  travelerLocation?: Location; // For Traveler's view
  tourGuideId?: string;
  travelerId?: string;
  attendees?: any;
}

const TrackingMap: React.FC<TrackingMapProps> = ({
  guideLocation,
  participantLocations,
  travelerLocation,
  tourGuideId,
  travelerId,
  attendees,
}) => {
  const initialRegion = {
    latitude: guideLocation.latitude,
    longitude: guideLocation.longitude,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1, borderRadius: 8 }}
        initialRegion={initialRegion}
      >
        {/* Tour guide marker */}
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

        {/* For Tour Guide: show all participants */}
        {participantLocations?.map((loc, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            pinColor="red"
            title={`Participant #${index + 1}`}
          />
        ))}

        {/* For Traveler: show traveler + guide */}
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
    </View>
  );
};

export default TrackingMap;
