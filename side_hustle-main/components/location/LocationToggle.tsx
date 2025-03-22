import React from 'react';
import { useLocation } from '@/contexts/LocationContext';

const LocationToggle: React.FC = () => {
  const { selectedLocation, setLocation } = useLocation();

  return (
    <div className="flex items-center justify-center space-x-4 bg-black/50 p-2 rounded-full border border-white/20 backdrop-blur-sm">
      <button
        onClick={() => setLocation('portland')}
        className={`px-4 py-2 rounded-full transition-all duration-300 ${
          selectedLocation === 'portland'
            ? 'bg-bar-accent text-white font-medium'
            : 'bg-transparent text-white/60 hover:text-white'
        }`}
      >
        Portland
      </button>
      <div className="w-px h-6 bg-white/20"></div>
      <button
        onClick={() => setLocation('salem')}
        className={`px-4 py-2 rounded-full transition-all duration-300 ${
          selectedLocation === 'salem'
            ? 'bg-bar-accent text-white font-medium'
            : 'bg-transparent text-white/60 hover:text-white'
        }`}
      >
        Salem
      </button>
    </div>
  );
};

export default LocationToggle; 