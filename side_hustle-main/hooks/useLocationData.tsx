import { useEffect, useState } from 'react';
import { useLocation } from '@/contexts/LocationContext';

// Define location data types
type LocationData = {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  serviceOptions: string[];
}

// Location data
const locationData = {
  portland: {
    name: "The Side Hustle Bar - Portland",
    description: "Our original location in downtown Portland. Come enjoy our famous tacos, craft cocktails, and vibrant nightlife atmosphere.",
    address: "123 Main St, Portland, OR 97201",
    phone: "(503) 555-1234",
    email: "contact@thesidehustleportland.com",
    serviceOptions: ["Dine-in", "Takeout", "Full Bar", "Late Night", "Weekend Brunch"]
  },
  salem: {
    name: "The Side Hustle Bar - Salem",
    description: "Our newest location in the heart of Salem. Experience our award-winning Mexican cuisine and signature cocktails in a stylish setting.",
    address: "456 State St, Salem, OR 97301",
    phone: "(503) 555-5678",
    email: "contact@thesidehustlesalem.com",
    serviceOptions: ["Dine-in", "Takeout", "Full Bar", "Live Music", "Patio Seating"]
  }
};

export const useLocationData = () => {
  const { selectedLocation } = useLocation();
  const [currentLocation, setCurrentLocation] = useState<LocationData>(locationData.portland);
  
  useEffect(() => {
    // Update location data when the selected location changes
    setCurrentLocation(locationData[selectedLocation]);
  }, [selectedLocation]);
  
  return { currentLocation };
}; 