/// <reference types="react" />
'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchToken } from '@/firebase';

export default function IOSInstructions(): React.ReactElement {
  const [notificationStatus, setNotificationStatus] = useState<'idle' | 'requested' | 'granted' | 'denied'>('idle');

  const requestNotificationPermission = async () => {
    setNotificationStatus('requested');
    
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setNotificationStatus('granted');
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

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-white hover:text-gray-300 mb-8 inline-flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        
        <div className="space-y-8">
          {/* Quick Start Guide */}
          <div className="bg-green-900/30 rounded-lg p-6 backdrop-blur-sm border border-green-500/20">
            <h2 className="text-xl font-bold mb-2 text-green-400">👋 Quick Start</h2>
            <p className="text-gray-300">You&apos;re just two quick steps away from getting set up:</p>
            <div className="mt-3 space-y-2">
              <p className="flex items-center text-gray-300">
                <span className="inline-block w-6 h-6 bg-green-500/20 rounded-full text-center mr-2">1</span>
                Add to your home screen using Safari
              </p>
              <p className="flex items-center text-gray-300">
                <span className="inline-block w-6 h-6 bg-green-500/20 rounded-full text-center mr-2">2</span>
                Enable notifications to stay updated
              </p>
            </div>
          </div>

          {/* Step 1: Installation */}
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="bg-white/20 w-8 h-8 rounded-full text-center leading-8 mr-3 text-lg">1</span>
              Add to Home Screen
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500/20 p-2 rounded-lg mt-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Using Safari Browser</h3>
                  <p className="text-gray-400 text-sm mb-2">Follow these simple steps:</p>
                  <ol className="space-y-3 text-sm text-gray-300 list-decimal list-inside ml-1">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2 mt-1">1.</span>
                      <div>
                        <p className="font-medium">Tap the Share button</p>
                        <p className="text-xs text-gray-400 mt-1">Look for the square with an arrow at the bottom of Safari</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2 mt-1">2.</span>
                      <div>
                        <p className="font-medium">Find &quot;Add to Home Screen&quot;</p>
                        <p className="text-xs text-gray-400 mt-1">Scroll down in the share menu if needed</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2 mt-1">3.</span>
                      <div>
                        <p className="font-medium">Tap &quot;Add&quot;</p>
                        <p className="text-xs text-gray-400 mt-1">The app will appear on your home screen</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="bg-amber-900/20 p-4 rounded-lg">
                <p className="text-sm text-amber-300 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Important: This only works in Safari browser on iOS
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Notifications */}
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="bg-white/20 w-8 h-8 rounded-full text-center leading-8 mr-3 text-lg">2</span>
              Enable Notifications
            </h2>

            {notificationStatus === 'idle' && (
              <div className="space-y-4">
                <p className="text-gray-300">Get notified about:</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Important updates and announcements
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Special events and promotions
                  </li>
                </ul>
                <button
                  onClick={requestNotificationPermission}
                  className="w-full bg-white text-black font-semibold py-3 px-6 rounded-md hover:bg-gray-200 transition-colors mt-4"
                >
                  Enable Notifications
                </button>
              </div>
            )}
            
            {notificationStatus === 'requested' && (
              <div className="bg-blue-900/50 p-6 rounded-md backdrop-blur-sm text-center space-y-3">
                <svg className="w-8 h-8 mx-auto text-blue-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <p className="text-lg font-medium">Check your notification prompt</p>
                <p className="text-sm text-gray-400">Please respond to the notification permission request that appeared</p>
              </div>
            )}
            
            {notificationStatus === 'granted' && (
              <div className="bg-green-900/50 p-6 rounded-md backdrop-blur-sm text-center space-y-3">
                <svg className="w-8 h-8 mx-auto text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium text-green-400">You&apos;re all set! 🎉</p>
                <p className="text-sm text-gray-300">You&apos;ll now receive important updates and announcements</p>
              </div>
            )}
            
            {notificationStatus === 'denied' && (
              <div className="space-y-4">
                <div className="bg-red-900/50 p-6 rounded-md backdrop-blur-sm text-center space-y-3">
                  <svg className="w-8 h-8 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium">Notifications are disabled</p>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-sm text-gray-300 mb-2">To enable notifications:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-400">
                    <li>Open iOS Settings</li>
                    <li>Scroll down and tap Notifications</li>
                    <li>Find this app in the list</li>
                    <li>Toggle &quot;Allow Notifications&quot; on</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 