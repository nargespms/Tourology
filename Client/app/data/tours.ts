export type Tour = {
  id: string;
  title: string;
  location: string;
  price: string;
  rating: number;
  placeImage: any;
  userName?: string;
  userImage?: any;
  isFree?: boolean;
};

// export const forYouData: Tour[] = [
//   {
//     id: "1",
//     title: "Lake Louise",
//     location: "Southwestern Alberta, Canada",
//     price: "299 CAD",
//     rating: 4.8,
//     placeImage: require("../../assets/tour-temp3.png"),
//     userName: "Sophia Bennett",
//     userImage: require("../../assets/avatar.png"),
//     isFree: false,
//   },
//   {
//     id: "2",
//     title: "Wascana Centre",
//     location: "Regina, Saskatchewan",
//     price: "399 CAD",
//     rating: 4.8,
//     placeImage: require("../../assets/tour-temp2.png"),
//     userName: "Matthew Hamilton",
//     userImage: require("../../assets/avatar.png"),
//     isFree: true,
//   },
//   {
//     id: "3",
//     title: "Banff National Park",
//     location: "Alberta, Canada",
//     price: "450 CAD",
//     rating: 4.7,
//     placeImage: require("../../assets/tour-temp1.png"),
//     userName: "Alice Tan",
//     userImage: require("../../assets/avatar.png"),
//   },
// ];

// export const followingData: Tour[] = [
//   {
//     id: "3",
//     title: "Banff National Park",
//     location: "Alberta, Canada",
//     price: "450 CAD",
//     rating: 4.7,
//     placeImage: require("../../assets/tour-temp1.png"),
//     userName: "Alice Tan",
//     userImage: require("../../assets/avatar.png"),
//   },
// ];

// export const freeData: Tour[] = [
//   {
//     id: "4",
//     title: "Central Park",
//     location: "New York, USA",
//     price: "FREE Entry",
//     rating: 4.9,
//     placeImage: require("../../assets/choose-role.png"),
//     userName: "John Doe",
//     userImage: require("../../assets/avatar.png"),
//     isFree: true,
//   },
// ];
// export const checkedInUsers = [
//   {
//     id: "1",
//     name: "James Robertson",
//     avatar: require("../../assets/avatar.png"),
//     checkedIn: true,
//     timeAgo: "10 minutes ago",
//     phone: "+1 555-1234",
//   },
//   {
//     id: "2",
//     name: "Maksym Tymchyk",
//     avatar: require("../../assets/avatar.png"),
//     checkedIn: true,
//     timeAgo: "50 minutes ago",
//     phone: "+1 555-5678",
//   },
//   {
//     id: "3",
//     name: "Negar Nikkhah",
//     avatar: require("../../assets/avatar.png"),
//     checkedIn: true,
//     timeAgo: "50 minutes ago",
//     phone: "+1 555-9012",
//   },
// ];

// export const awaitingUsers = [
//   {
//     id: "4",
//     name: "Mohsen Ameri",
//     avatar: require("../../assets/avatar.png"),
//     checkedIn: false,
//     phone: "+1 555-3456",
//   },
//   {
//     id: "5",
//     name: "Alyssa Jane",
//     avatar: require("../../assets/avatar.png"),
//     checkedIn: false,
//     phone: "+1 555-7890",
//   },
// ];

export const tourCategories = [
  "Historical Tours",
  "Adventure",
  "Culinary",
  "Cultural",
];
