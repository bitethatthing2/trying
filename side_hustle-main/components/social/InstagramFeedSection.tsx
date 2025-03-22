import React, { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';
import Head from 'next/head';

const InstagramFeedSection: React.FC = () => {
  const [elfsightLoaded, setElfsightLoaded] = useState(true);

  // Check if Elfsight failed to load after a timeout
  useEffect(() => {
    // Wait 5 seconds to see if Elfsight loads
    const timer = setTimeout(() => {
      // Check if the Elfsight container has content
      const container = document.querySelector('.elfsight-app-3e805b8a-5eab-4485-93cc-489d1122c66c');
      if (container && container.children.length === 0) {
        console.warn('Elfsight Instagram widget failed to load, showing fallback');
        setElfsightLoaded(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Suppress deprecation warnings for -ms-high-contrast
  useEffect(() => {
    const originalConsoleWarn = console.warn;
    console.warn = function(...args) {
      // Filter out the -ms-high-contrast deprecation warnings
      if (typeof args[0] === 'string' && args[0].includes('-ms-high-contrast')) {
        return;
      }
      return originalConsoleWarn.apply(console, args);
    };

    return () => {
      console.warn = originalConsoleWarn;
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer-when-downgrade" />
      </Head>
      
      <section className="py-12 md:py-16 bg-black w-full">
        <div className="w-full max-w-[100%] px-2">
          <h2 className="section-title text-center mx-auto mb-6">Follow Us on Instagram</h2>
          <div className="flex items-center justify-center gap-2 mb-8">
            <Instagram className="h-5 w-5 text-bar-accent" />
            <p className="text-center text-gray-300 max-w-full">
              Tag us in your photos using #SidehustleBar for a chance to be featured!
            </p>
          </div>
          
          <div className="w-full overflow-hidden">
            {elfsightLoaded ? (
              <div className="elfsight-app-3e805b8a-5eab-4485-93cc-489d1122c66c" data-elfsight-app-lazy></div>
            ) : (
              <div className="bg-gray-800/30 p-8 rounded-lg border border-gray-700">
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-xl text-white mb-4">Our Instagram Feed</h3>
                  <p className="text-gray-300 mb-6">
                    Follow us on Instagram to see our latest events, specials, and behind-the-scenes content!
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map((image) => (
                      <div key={image} className="aspect-square bg-gray-700/50 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                  <a 
                    href="https://www.instagram.com/sidehustlebar" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Instagram className="h-5 w-5" />
                    <span>Visit Our Instagram</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default InstagramFeedSection; 