export type Booking = {
  id: string;
  title: string;
  location: string;
  date: string;
  image: any;
  rating: number;
  status: "paid" | "pending";
  qrCodeValue: string; // Unique QR code for each booking
};

export type ActiveTour = {
  id: string;
  title: string;
  location: string;
  image: any;
  participantCount: number;
  startTime: string;
};

export const upcomingBookings: Booking[] = [
  {
    id: "1",
    title: "Lake Louise",
    location: "Southwestern Alberta, Canada",
    date: "Friday, 18th Jun",
    image: require("../../assets/tour-temp3.png"),
    status: "paid",
    rating: 4.8,
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
    rating: 4.2,
    qrCodeValue: "booking-654321",
  },
  {
    id: "1",
    title: "Lake Louise",
    location: "Southwestern Alberta, Canada",
    date: "Friday, 18th Jun",
    image: require("../../assets/tour-temp3.png"),
    status: "paid",
    rating: 3.8,
    qrCodeValue: "booking-123456", // Unique ID for QR
  },
];

export const activeTour: ActiveTour | null = {
  id: "1",
  title: "Lake Louise",
  location: "Southwestern Alberta, Canada",
  image: require("../../assets/tour-temp3.png"),
  participantCount: 26,
  startTime: "In an hour",
};
