import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

import { ROUTE_COORDS, STOPS } from "../data/routeDetailsMock";
import { Tour } from "../types/tour";
import { getMediaSrc } from "../api/media";

type TourStopsProps = {
  tour: Tour;
};

const TourStops = (props: TourStopsProps) => {
  const { tour } = props;

  const [mapInteractionEnabled, setMapInteractionEnabled] = useState(false);
  const handleMarkerPress = (stop: any) => {
    Alert.alert(stop.name, stop.description);
  };

  const stopsArray = Object.values(tour.stops);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => setMapInteractionEnabled(true)}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitudeDelta: 0.2,
              longitudeDelta: 0.2,
              longitude: stopsArray[0].region.coordinates[0],
              latitude: stopsArray[0].region.coordinates[1],
            }}
            scrollEnabled={mapInteractionEnabled}
            zoomEnabled={mapInteractionEnabled}
            rotateEnabled={mapInteractionEnabled}
          >
            <Polyline
              coordinates={stopsArray.map((stop) => ({
                latitude: stop.region.coordinates[1],
                longitude: stop.region.coordinates[0],
              }))}
              strokeColor="#007AFF"
              strokeWidth={3}
            />
            {stopsArray.map((stop) => (
              <Marker
                key={stop.id}
                coordinate={{
                  latitude: stop.region.coordinates[1],
                  longitude: stop.region.coordinates[0],
                }}
                onPress={() => handleMarkerPress(stop)}
              />
            ))}
          </MapView>
        </View>
      </TouchableWithoutFeedback>

      {stopsArray.map((stop, index) => (
        <View style={styles.stopItem} key={stop.id}>
          <View style={{ width: "78%", paddingRight: 12 }}>
            <Text style={styles.stopTitle}>
              {index + 1}. {stop.name}
            </Text>
            <Text style={styles.stopTime}>{stop.time}</Text>
            <Text style={styles.stopDescription}>{stop.description}</Text>
          </View>
          <View>
            <Image
              source={{ uri: getMediaSrc(stop.photo) }}
              style={styles.stopImage}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  mapContainer: {
    width: "95%",
    height: 200,
    margin: "auto",
  },
  map: {
    flex: 1,
    borderRadius: 8,
    marginBottom: 25,
  },
  stopItem: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
  stopTitle: {
    fontWeight: "600",
    fontSize: 15,
  },
  stopTime: {
    color: "#777",
    fontSize: 13,
    marginVertical: 4,
    paddingLeft: 16,
  },
  stopDescription: {
    fontSize: 13,
    color: "#777",
    marginVertical: 4,
    paddingLeft: 16,
  },
  stopImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginTop: 6,
    resizeMode: "cover",
  },
});

export default TourStops;
