export type Region = {
  type: "Point";
  coordinates: [number, number];
};

export type Host = {
  id: string;
  name: string;
  profilePicture?: string;
};

export type Review = {
  date: Date;
  id: string;
  rating: number;
  description: string;
  user: {
    id: string;
    name: string;
  };
};

export type Stop = {
  id: string;
  name: string;
  description: string;
  location: string;
  region: Region;
  time?: string;
  photo?: string;
};

export type Attendee = {
  id: string;
  name: string;
  phone?: string;
  checkedIn: boolean;
};

export type Tour = {
  _id: string;
  name: string;
  description: string;
  location: string;
  region: Region;
  paid: boolean;
  price?: number;
  state: string;
  host: Host;
  maxAttendees?: number;
  startDate?: string;
  endDate?: string;
  rating?: number;
  reviews?: Record<string, Review>;
  stops: Record<string, Stop>;
  photos?: string[];
  attendees?: Record<string, Attendee>;
};

export type Booking = Tour & {
  upcoming: boolean;
};
