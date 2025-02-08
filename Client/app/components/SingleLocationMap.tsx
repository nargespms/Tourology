import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

interface SingleLocationMapProps {
  region: {
    type: "Point";
    coordinates: [number, number];
  };
}

const SingleLocationMap: React.FC<SingleLocationMapProps> = ({ region }) => {
  const [mapInteractionEnabled, setMapInteractionEnabled] = useState(false);
  const handleMarkerPress = (stop: any) => {
    Alert.alert(stop.title, stop.description);
  };

  return (
    <View>
      <TouchableWithoutFeedback onPress={() => setMapInteractionEnabled(true)}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={
              {
                latitude: region.coordinates[1],
                longitude: region.coordinates[0],
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              } as any
            }
            scrollEnabled={mapInteractionEnabled}
            zoomEnabled={mapInteractionEnabled}
            rotateEnabled={mapInteractionEnabled}
          >
            <Marker
              coordinate={
                {
                  latitude: region.coordinates[1],
                  longitude: region.coordinates[0],
                } as any
              }
            />
          </MapView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    marginTop: 8,
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default SingleLocationMap;
