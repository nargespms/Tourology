type Location = {
  latitude: number;
  longitude: number;
};

export function calcDistanceInKm(loc1: Location, loc2: Location) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(loc2.latitude - loc1.latitude);
  const dLon = deg2rad(loc2.longitude - loc1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(loc1.latitude)) *
      Math.cos(deg2rad(loc2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  if (distance < 1) {
    return Math.round(distance * 1000) + " m"; // Convert to meters
  }

  return Math.round(distance * 10) / 10 + " km"; // Convert to km with one decimal
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
