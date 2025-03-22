"use client";

import { useEffect, useRef, useState } from "react";
import { fetchToken, setupForegroundMessageHandler, isIOS } from "@/firebase";
import { toast } from "sonner";

// For debugging version mismatches
const HOOK_VERSION = '2.0.0';

async function getNotificationPermissionAndToken() {
  console.log(`[useFcmToken v${HOOK_VERSION}] Starting permission and token fetch process`);
  
  // Check if Notifications are supported in the browser
  if (!("Notification" in window)) {
    console.info(`[useFcmToken v${HOOK_VERSION}] This browser does not support desktop notification`);
    return { token: null, isDevelopmentMode: false };
  }

  // Log current permission state
  console.log(`[useFcmToken v${HOOK_VERSION}] Current notification permission: ${Notification.permission}`);
  
  // Check if permission is already granted
  if (Notification.permission === "granted") {
    console.log(`[useFcmToken v${HOOK_VERSION}] Notification permission already granted`);
    const token = await fetchToken();
    
    // Check if we're using a development token
    const isDevelopmentMode = token === "test-token-for-ui-development";
    console.log(`[useFcmToken v${HOOK_VERSION}] Token fetched, isDevelopmentMode: ${isDevelopmentMode}`);
    
    return { token, isDevelopmentMode };
  }

  // If permission is not denied, request permission from the user
  if (Notification.permission !== "denied") {
    console.log(`[useFcmToken v${HOOK_VERSION}] Requesting notification permission...`);
    const permission = await Notification.requestPermission();
    console.log(`[useFcmToken v${HOOK_VERSION}] Permission request result: ${permission}`);
    
    if (permission === "granted") {
      console.log(`[useFcmToken v${HOOK_VERSION}] Notification permission granted, fetching token...`);
      const token = await fetchToken();
      
      // Check if we're using a development token
      const isDevelopmentMode = token === "test-token-for-ui-development";
      console.log(`[useFcmToken v${HOOK_VERSION}] Token fetched, isDevelopmentMode: ${isDevelopmentMode}`);
      
      return { token, isDevelopmentMode };
    }
  }

  console.log(`[useFcmToken v${HOOK_VERSION}] Notification permission not granted.`);
  return { token: null, isDevelopmentMode: false };
}

const useFcmToken = () => {
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<NotificationPermission | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);
  const retryLoadToken = useRef(0);
  const isLoading = useRef(false);
  const messageHandlerRef = useRef<any>(null);

  const loadToken = async () => {
    // Prevent multiple fetches if already in progress
    if (isLoading.current) {
      console.log(`[useFcmToken v${HOOK_VERSION}] Token load already in progress, skipping...`);
      return;
    }

    console.log(`[useFcmToken v${HOOK_VERSION}] Starting token load process...`);
    isLoading.current = true;
    const { token, isDevelopmentMode } = await getNotificationPermissionAndToken();

    // Handle permission denied
    if (Notification.permission === "denied") {
      console.log(`[useFcmToken v${HOOK_VERSION}] Permission denied, stopping token fetch`);
      setNotificationPermissionStatus("denied");
      isLoading.current = false;
      return;
    }

    // Retry fetching token if necessary (up to 3 times)
    if (!token) {
      if (retryLoadToken.current >= 3) {
        console.log(`[useFcmToken v${HOOK_VERSION}] Max retries reached, giving up`);
        toast.error("Unable to initialize notifications");
        isLoading.current = false;
        return;
      }

      retryLoadToken.current += 1;
      console.log(`[useFcmToken v${HOOK_VERSION}] Retrying token fetch, attempt ${retryLoadToken.current}/3`);
      isLoading.current = false;
      await loadToken();
      return;
    }

    // Set token and status
    console.log(`[useFcmToken v${HOOK_VERSION}] Token obtained: ${token.substring(0, 10)}...`);
    setNotificationPermissionStatus(Notification.permission);
    setToken(token);
    setIsDevelopmentMode(isDevelopmentMode);
    
    // Show development mode toast
    if (isDevelopmentMode) {
      toast.info(
        "Using development mode for notifications due to SSL certificate issues. This is expected in local development.",
        { duration: 6000 }
      );
    }
    
    isLoading.current = false;
  };

  useEffect(() => {
    console.log(`[useFcmToken v${HOOK_VERSION}] Hook mounted, checking for notification support`);
    if ("Notification" in window) {
      const deviceIsIOS = isIOS();
      console.log(`[useFcmToken v${HOOK_VERSION}] Device is iOS: ${deviceIsIOS}`);
      
      if (!deviceIsIOS) {
        // Non-iOS devices request permission immediately
        console.log(`[useFcmToken v${HOOK_VERSION}] Non-iOS device detected, requesting permission immediately`);
        loadToken();
      } else {
        // For iOS, defer permission request until user interaction
        console.log(`[useFcmToken v${HOOK_VERSION}] iOS detected, deferring permission request until user interaction`);
      }
    } else {
      console.log(`[useFcmToken v${HOOK_VERSION}] Notifications not supported in this browser`);
    }
  }, []);

  useEffect(() => {
    const setupListener = async () => {
      if (!token) {
        console.log(`[useFcmToken v${HOOK_VERSION}] No token available, skipping message handler setup`);
        return;
      }

      console.log(`[useFcmToken v${HOOK_VERSION}] Setting up foreground message handler with token ${token.substring(0, 10)}...`);
      
      // Set up foreground message handler
      const unsubscribe = await setupForegroundMessageHandler();
      
      if (unsubscribe) {
        console.log(`[useFcmToken v${HOOK_VERSION}] Message handler set up successfully`);
        messageHandlerRef.current = unsubscribe;
      } else {
        console.log(`[useFcmToken v${HOOK_VERSION}] Failed to set up message handler`);
      }
    };

    setupListener();

    // Cleanup the listener when component unmounts
    return () => {
      if (messageHandlerRef.current) {
        console.log(`[useFcmToken v${HOOK_VERSION}] Cleaning up message handler`);
        messageHandlerRef.current();
      }
    };
  }, [token]);

  // Function to request notification permission (for iOS)
  const requestNotificationPermission = async () => {
    console.log(`[useFcmToken v${HOOK_VERSION}] User initiated notification permission request`);
    await loadToken();
  };

  return { 
    token, 
    notificationPermissionStatus, 
    isDevelopmentMode,
    requestNotificationPermission 
  };
};

export default useFcmToken;
