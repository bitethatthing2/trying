import React, { useState } from 'react';
import LocationToggle from './location/LocationToggle';
import { useLocation } from '@/contexts/LocationContext';
import { Menu } from 'lucide-react';

const HeroSection: React.FC = () => {
  const { selectedLocation } = useLocation();
  const [imgError, setImgError] = useState(false);
  const [imgErrorCount, setImgErrorCount] = useState(0);
  
  // Define possible paths to try in order
  const portlandPaths = [
    '/only_these/logos/SHB_Logo_WhiteonBlackBG.png',
    '/SHB_Logo_WhiteonBlackBG.png',
    '/logo.png'
  ];
  
  const salemPaths = [
    '/only_these/logos/salem_location.png',
    '/salem_location.png',
    '/logo.png'
  ];
  
  // Get the current path to try based on location and error count
  const getImagePath = () => {
    const paths = selectedLocation === 'portland' ? portlandPaths : salemPaths;
    return paths[Math.min(imgErrorCount, paths.length - 1)];
  };
  
  const logoImage = getImagePath();
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Error loading image: ${logoImage}, trying next path...`);
    setImgErrorCount(prev => prev + 1);
    
    // Force a re-render by toggling imgError
    setImgError(prev => !prev);
    
    // Prevent the default error icon
    e.currentTarget.onerror = null;
  };
  
  return (
    <section className="relative min-h-[80vh] flex flex-col overflow-hidden bg-black border-b border-bar-accent/20 w-full -mt-16">
      <div className="absolute inset-0 bg-black z-10 overflow-hidden">
        {/* Animated light beams */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-[1px] h-full bg-bar-accent animate-pulse-subtle"></div>
          <div className="absolute top-0 left-2/4 w-[1px] h-full bg-bar-accent animate-pulse-subtle animation-delay-700"></div>
          <div className="absolute top-0 left-3/4 w-[1px] h-full bg-bar-accent animate-pulse-subtle animation-delay-1300"></div>
        </div>
      </div>
      
      <div className="w-full relative z-20 text-center px-2 flex flex-col h-full">
        <div className="flex-grow flex flex-col items-center justify-start pt-32 md:pt-36 lg:pt-40 pb-10">
          <img 
            src={logoImage} 
            alt="The Sidehustle Bar" 
            className="max-w-[300px] sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mt-8"
            onError={handleImageError}
          />
          
          <div className="mt-6 mb-6 w-full flex justify-center">
            <LocationToggle />
          </div>
          
          <div className="text-lg md:text-xl lg:text-2xl text-white font-medium mb-8 md:mb-10 mx-auto rounded-lg backdrop-blur-lg p-4 border border-white/10 bg-black holographic-border">
            <p className="mb-2">High-Energy Sports Bar • Restaurant • Nightclub<br/>
            <span className="text-bar-accent">Featuring Executive Chef Rebecca Sanchez</span><br/>
            <span className="text-sm md:text-base italic">#1 Rated Mexican Food & Best Tacos in Town</span></p>
            <div className="flex items-center justify-center mt-4 text-base md:text-lg">
              <Menu className="w-5 h-5 mr-2 text-bar-accent animate-pulse-subtle" />
              <span>Access all the app's features by clicking the corner menu button.</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-bar-accent/50 to-transparent"></div>
    </section>
  );
};

export default HeroSection; 