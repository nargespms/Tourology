export type Booking = {
  id: string;
  title: string;
  location: string;
  date: string;
  image: any;
  status: "paid" | "pending";
  qrCodeValue: string; // Unique QR code for each booking
};

export const upcomingBookings: Booking[] = [
  {
    id: "1",
    title: "Lake Louise",
    location: "Southwestern Alberta, Canada",
    date: "Friday, 18th Jun",
    image: require("../../assets/tour-temp3.png"),
    status: "paid",
    qrCodeValue: "booking-123456", // Unique ID for QR
  },
];

export const pastBookings: Booking[] = [
  {
    id: "2",
    title: "Banff National Park",
    location: "Alberta, Canada",
    date: "Monday, 10th Jan",
    image: require("../../assets/tour-temp1.png"),
    status: "paid",
    qrCodeValue: "booking-654321",
  },
];
