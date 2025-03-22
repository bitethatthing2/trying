import React from 'react';
import { MapPin, Bell } from 'lucide-react';
import { useLocationData } from '@/hooks/useLocationData';
import { useLocation } from '@/contexts/LocationContext';

const InfoSection: React.FC = () => {
  const { currentLocation } = useLocationData();
  const { selectedLocation } = useLocation();
  
  return (
    <section className="py-12 md:py-16 bg-black w-full">
      <div className="w-full max-w-[100%] px-2">
        {/* Location description */}
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">{currentLocation.name}</h2>
          <p className="text-gray-300 text-lg mb-4 mx-auto">{currentLocation.description}</p>
          <div className="flex flex-wrap justify-center gap-4 items-center">
            {currentLocation.serviceOptions.map((option, index) => (
              <span key={index} className="bg-bar-accent/20 text-white text-sm px-3 py-1 rounded-full border border-bar-accent/30">
                {option}
              </span>
            ))}
          </div>
        </div>
      
        {/* Location */}
        <div className="bg-black border border-gray-800 hover:border-bar-accent/30 rounded-lg p-4 md:p-6 shadow-lg holographic-border">
          <div className="flex flex-col items-center text-center">
            <MapPin className="h-10 w-10 md:h-12 md:w-12 text-bar-accent mb-3 md:mb-4" />
            <h3 className="font-display text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Location</h3>
            <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
              {currentLocation.address}
            </p>
            <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
              <strong className="text-white">Phone:</strong> {currentLocation.phone}<br />
              <strong className="text-white">Email:</strong> {currentLocation.email}
            </p>
            <a 
              href={`https://maps.google.com/maps?q=${encodeURIComponent(currentLocation.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bar-accent text-sm hover:underline"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
          
        {/* Connect */}
        <div className="bg-black border border-gray-800 hover:border-bar-accent/30 rounded-lg p-4 md:p-6 shadow-lg holographic-border">
          <div className="flex flex-col items-center text-center">
            <Bell className="h-10 w-10 md:h-12 md:w-12 text-bar-accent mb-3 md:mb-4" />
            <h3 className="font-display text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Stay Connected</h3>
            <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
              Enable notifications to stay updated with our latest events, special offers, and happy hour announcements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection; 