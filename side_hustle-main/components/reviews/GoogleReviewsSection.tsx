import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const GoogleReviewsSection: React.FC = () => {
  const [elfsightLoaded, setElfsightLoaded] = useState(true);

  // Check if Elfsight failed to load after a timeout
  useEffect(() => {
    // Wait 5 seconds to see if Elfsight loads
    const timer = setTimeout(() => {
      // Check if the Elfsight container has content
      const container = document.querySelector('.elfsight-app-f4fdffed-81de-4d5d-b688-2da302faebbe');
      if (container && container.children.length === 0) {
        console.warn('Elfsight widget failed to load, showing fallback');
        setElfsightLoaded(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Handle tracking prevention errors for Google userContent images
  useEffect(() => {
    const handleErrors = (event: ErrorEvent) => {
      if (event.message && event.message.includes('Tracking Prevention') && 
          event.message.includes('googleusercontent.com')) {
        console.warn('Tracking prevention for Google User Images - using fallback');
      }
    };

    window.addEventListener('error', handleErrors);
    return () => window.removeEventListener('error', handleErrors);
  }, []);

  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer-when-downgrade" />
      </Head>
      
      <section className="py-12 md:py-16 bg-black w-full">
        <div className="w-full max-w-[100%] px-2">
          <div className="text-center mb-8">
            <h2 className="section-title text-center mx-auto mb-4">Leave Us A Review</h2>
            <p className="text-gray-300 text-lg mb-4 mx-auto max-w-full">
              Don't just take our word for it. See what our customers have to say about their experiences.
            </p>
          </div>
          
          <div className="w-full overflow-hidden">
            {elfsightLoaded ? (
              <div className="elfsight-app-f4fdffed-81de-4d5d-b688-2da302faebbe" data-elfsight-app-lazy></div>
            ) : (
              <div className="bg-gray-800/30 p-8 rounded-lg border border-gray-700">
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-xl text-white mb-4">Google Reviews</h3>
                  <p className="text-gray-300 mb-4">
                    Check out our 4.8 star rating on Google! We appreciate all of our customers' feedback.
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400 text-2xl">★</span>
                    ))}
                  </div>
                  <p className="text-yellow-400 font-bold text-xl mb-4">4.8 / 5</p>
                  <a 
                    href="https://www.google.com/search?q=side+hustle+bar+reviews" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    See Our Reviews on Google
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

// Add the global type declaration
declare global {
  interface Window {
    elfsight?: {
      initialize: () => void;
    }
  }
}

export default GoogleReviewsSection; 