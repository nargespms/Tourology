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

const TourStops = () => {
  const [mapInteractionEnabled, setMapInteractionEnabled] = useState(false);
  const handleMarkerPress = (stop: any) => {
    Alert.alert(stop.title, stop.description);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => setMapInteractionEnabled(true)}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 51.1784,
              longitude: -115.5708,
              latitudeDelta: 1.5,
              longitudeDelta: 1.5,
            }}
            scrollEnabled={mapInteractionEnabled}
            zoomEnabled={mapInteractionEnabled}
            rotateEnabled={mapInteractionEnabled}
          >
            <Polyline
              coordinates={ROUTE_COORDS}
              strokeColor="#007AFF"
              strokeWidth={3}
            />
            {STOPS.map((stop) => (
              <Marker
                key={stop.id}
                coordinate={stop.coordinate}
                onPress={() => handleMarkerPress(stop)}
              />
            ))}
          </MapView>
        </View>
      </TouchableWithoutFeedback>

      {STOPS.map((stop) => (
        <View style={styles.stopItem} key={stop.id}>
          <View>
            <Text style={styles.stopTitle}>
              {stop.id}. {stop.title}
            </Text>
            <Text style={styles.stopTime}>{stop.time}</Text>
            <Text style={styles.stopDescription}>{stop.description}</Text>
          </View>
          <View>
            <Image source={stop.image} style={styles.stopImage} />
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
    paddingHorizontal: 16,
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
