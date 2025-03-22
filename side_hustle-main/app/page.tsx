/** @jsxImportSource react */
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchToken } from '@/firebase';
import Image from 'next/image';
import GoogleReviewsSection from '@/components/reviews/GoogleReviewsSection';
import { LocationProvider } from '@/contexts/LocationContext';
import dynamic from 'next/dynamic';

// Import components dynamically to avoid hydration issues
const HeroSection = dynamic(() => import('@/components/HeroSection'), {
  ssr: false,
  loading: () => <div className="min-h-[80vh] flex items-center justify-center bg-black">Loading...</div>
});

const InfoSection = dynamic(() => import('@/components/InfoSection'), {
  ssr: false,
  loading: () => <div className="py-12 flex items-center justify-center bg-black">Loading location info...</div>
});

const InstagramFeedSection = dynamic(() => import('@/components/social/InstagramFeedSection'), {
  ssr: false,
  loading: () => <div className="py-12 flex items-center justify-center bg-black">Loading Instagram feed...</div>
});

export default function Home(): React.ReactElement {
  const [deviceType, setDeviceType] = useState<'unknown' | 'ios' | 'android'>('unknown');
  const [notificationStatus, setNotificationStatus] = useState<'idle' | 'requested' | 'granted' | 'denied'>('idle');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setDeviceType('ios');
    } else if (/android/i.test(userAgent)) {
      setDeviceType('android');
    }

    // Handle PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });

    // Reset installable state when PWA is installed
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
    });
  }, []);

  const requestNotificationPermission = async () => {
    setNotificationStatus('requested');
    
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setNotificationStatus('granted');
        // Get FCM token
        try {
          await fetchToken();
        } catch (error) {
          console.error('Error getting FCM token:', error);
        }
      } else {
        setNotificationStatus('denied');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setNotificationStatus('denied');
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  return (
    <LocationProvider>
      <main className="flex min-h-screen flex-col items-center justify-between bg-black">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Info Section with Location Details */}
        <InfoSection />
        
        {/* Installation Section */}
        <div className="w-full bg-black py-12">
          <div className="container mx-auto max-w-3xl px-4">
            {deviceType !== 'unknown' && (
              <div className="w-full max-w-md p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 shadow-xl animate-slide-up space-y-4 mx-auto">
                <p className="text-white mb-4 text-center text-lg">
                  {deviceType === 'ios' ? 'Add to Home Screen' : 'Install App'}
                </p>
                {deviceType === 'android' && isInstallable ? (
                  <button
                    onClick={handleInstallClick}
                    className="w-full bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg inline-block text-center font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Install App
                  </button>
                ) : (
                  <Link 
                    href={deviceType === 'ios' ? '/instructions/ios' : '/instructions/android'} 
                    className="w-full bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg inline-block text-center font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    {deviceType === 'ios' ? 'How to Add to Home Screen' : 'How to Install'}
                  </Link>
                )}
              </div>
            )}

            {/* Notification Status Section */}
            <div className="w-full max-w-md animate-fade-in-delay-2 mx-auto mt-8">
              {notificationStatus === 'idle' && (
                <button
                  onClick={requestNotificationPermission}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Enable Notifications
                </button>
              )}
              
              {notificationStatus === 'requested' && (
                <div className="bg-blue-900/30 p-6 rounded-lg backdrop-blur-sm border border-blue-500/30 shadow-lg">
                  <p className="text-white text-center text-lg">Please respond to the notification permission prompt</p>
                </div>
              )}
              
              {notificationStatus === 'granted' && (
                <div className="bg-green-900/30 p-6 rounded-lg backdrop-blur-sm border border-green-500/30 shadow-lg">
                  <p className="text-white text-center text-lg font-medium">Notifications enabled successfully!</p>
                </div>
              )}
              
              {notificationStatus === 'denied' && (
                <div className="bg-red-900/30 p-6 rounded-lg backdrop-blur-sm border border-red-500/30 shadow-lg">
                  <p className="text-white text-center text-lg font-medium">Notification permission denied</p>
                  <p className="text-gray-300 text-center mt-2">To enable notifications, please check your browser settings</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Google Reviews Section */}
        <GoogleReviewsSection />
        
        {/* Instagram Feed Section */}
        <InstagramFeedSection />
      </main>
    </LocationProvider>
  );
}