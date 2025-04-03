export type NavItem = {
  id: string;
  label: string;
  icon: string;
  enable?: boolean;
};
export const travelerNavbar: NavItem[] = [
  {
    id: "1",
    label: "Home",
    icon: "home-outline",
    enable: true,
  },
  {
    id: "2",
    label: "Bookings",
    icon: "calendar-outline",
    enable: true,
  },
  {
    id: "3",
    label: "Profile",
    icon: "person-outline",
    enable: false,
  },
];
export const tourGuideNavbar: NavItem[] = [
  {
    id: "1",
    label: "Home",
    icon: "home-outline",
    enable: true,
  },
  {
    id: "2",
    label: "Explore",
    icon: "globe-outline",
    enable: false,
  },
  {
    id: "3",
    label: "check-ins",
    icon: "checkmark-circle-outline",
    enable: true,
  },
  {
    id: "4",
    label: "Profile",
    icon: "person-outline",
    enable: true,
  },
];
