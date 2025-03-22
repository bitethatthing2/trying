import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type LocationType = 'portland' | 'salem';

interface LocationContextType {
  selectedLocation: LocationType;
  setLocation: (location: LocationType) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationType>('portland');

  // Load saved location from localStorage on initial render
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation === 'portland' || savedLocation === 'salem') {
      setSelectedLocation(savedLocation);
    }
  }, []);

  // Save location to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedLocation', selectedLocation);
  }, [selectedLocation]);

  const setLocation = (location: LocationType) => {
    setSelectedLocation(location);
  };

  return (
    <LocationContext.Provider value={{ selectedLocation, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}; 