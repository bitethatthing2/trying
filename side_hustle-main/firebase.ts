import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage, MessagePayload } from "firebase/messaging";

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0Nxf3pvW32KBc0D1o2-K6qIeKovhGWfg",
  authDomain: "new1-f04b3.firebaseapp.com",
  projectId: "new1-f04b3",
  storageBucket: "new1-f04b3.firebasestorage.app",
  messagingSenderId: "802463638703",
  appId: "1:802463638703:web:bd0bbdaf3407d784d5205a",
  measurementId: "G-3RZEW537LN"
};

// Helper function to check if device is iOS
export const isIOS = () => {
  return typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Get messaging instance
const messaging = async () => {
  const supported = await isSupported();
  console.log("Is messaging supported:", supported);
  if (!supported) {
    console.log("Firebase messaging is not supported in this environment");
    return null;
  }
  return getMessaging(app);
};

// Track processed notification IDs to prevent duplicates
const processedNotifications = new Set();

// For debugging and coordination with SW
const CLIENT_VERSION = '2.0.0';

// Fetch FCM token
export const fetchToken = async () => {
  try {
    console.log("Attempting to fetch FCM token...");
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      console.log("Messaging initialized, fetching token...");
      
      // Try to get VAPID key from window.ENV first, then fall back to process.env
      const vapidKey = typeof window !== 'undefined' && (window as any).ENV?.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY 
        ? (window as any).ENV.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY 
        : process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY;
      
      console.log("Using VAPID key:", vapidKey ? "Key exists" : "Key missing");
      
      // Check if we're in a development environment with a self-signed certificate
      const isDevelopmentWithUntrustedCert = 
        typeof window !== 'undefined' && 
        (window.location.protocol !== 'https:' || 
         (window.location.hostname === 'localhost' && 
          !window.isSecureContext));
      
      if (isDevelopmentWithUntrustedCert) {
        console.log("Development environment detected, using test token");
        return "test-token-for-ui-development";
      }
      
      // Register service worker if needed - IMPORTANT: Handle this explicitly to avoid duplicates
      let serviceWorkerRegistration = null;
      if ('serviceWorker' in navigator) {
        try {
          // First, unregister ALL existing service workers to prevent duplicates
          console.log('Checking for existing service workers...');
          const registrations = await navigator.serviceWorker.getRegistrations();
          
          if (registrations.length > 0) {
            console.log(`Found ${registrations.length} existing service worker(s), unregistering...`);
            for (const registration of registrations) {
              console.log(`Unregistering service worker with scope: ${registration.scope}`);
              await registration.unregister();
              console.log('Service worker unregistered');
            }
          }
          
          // Register a fresh service worker
          console.log('Registering new service worker...');
          serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/'
          });
          console.log('Service worker registered with scope:', serviceWorkerRegistration.scope);
          
          // Wait for the service worker to be ready
          await navigator.serviceWorker.ready;
          console.log('Service worker is now ready and active');
        } catch (error) {
          console.error("Error managing service worker:", error);
        }
      }
      
      // Get token with the proper options
      const tokenOptions: {
        vapidKey: string;
        serviceWorkerRegistration?: ServiceWorkerRegistration;
      } = {
        vapidKey: vapidKey || '',
      };
      
      if (serviceWorkerRegistration) {
        tokenOptions.serviceWorkerRegistration = serviceWorkerRegistration;
      }
      
      // Add a small delay to ensure service worker is fully registered
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Getting FCM token with options:', {
        vapidKey: vapidKey ? '[KEY_PRESENT]' : '[KEY_MISSING]',
        serviceWorker: serviceWorkerRegistration ? 'Present' : 'Missing'
      });
      
      const token = await getToken(fcmMessaging, tokenOptions);
      console.log("FCM token obtained:", token ? token.substring(0, 10) + "..." : "null");
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

// Setup foreground message handler
export const setupForegroundMessageHandler = async () => {
  console.log(`[Client v${CLIENT_VERSION}] Setting up foreground message handler`);
  const m = await messaging();
  if (!m) {
    console.log(`[Client v${CLIENT_VERSION}] Messaging not supported, skipping handler setup`);
    return null;
  }

  console.log(`[Client v${CLIENT_VERSION}] Successfully installed foreground message handler`);
  
  return onMessage(m, (payload: MessagePayload) => {
    console.log(`[Client v${CLIENT_VERSION}] Foreground message received:`, payload);
    
    if (!payload.data && !payload.notification) {
      console.log(`[Client v${CLIENT_VERSION}] Empty message payload, ignoring`);
      return;
    }

    if (Notification.permission !== 'granted') {
      console.log(`[Client v${CLIENT_VERSION}] Notification permission not granted, skipping foreground notification`);
      return;
    }

    // Extract notification ID to prevent duplicates
    const notificationId = payload.messageId || payload.collapseKey || Date.now().toString();
    console.log(`[Client v${CLIENT_VERSION}] Notification ID: ${notificationId}`);
    
    // Skip if we've already processed this notification
    if (processedNotifications.has(notificationId)) {
      console.log(`[Client v${CLIENT_VERSION}] Skipping duplicate notification ${notificationId}`);
      return;
    }
    
    // Add to processed set
    processedNotifications.add(notificationId);
    console.log(`[Client v${CLIENT_VERSION}] Added notification ${notificationId} to processed set. Total: ${processedNotifications.size}`);
    
    // Keep the set small by removing older notifications
    if (processedNotifications.size > 20) {
      const oldestId = processedNotifications.values().next().value;
      processedNotifications.delete(oldestId);
      console.log(`[Client v${CLIENT_VERSION}] Removed oldest notification ${oldestId} from processed set`);
    }

    const deviceIsIOS = isIOS();
    console.log(`[Client v${CLIENT_VERSION}] Device is iOS: ${deviceIsIOS}`);
    
    // For non-iOS: Let service worker handle the notification 
    if (!deviceIsIOS) {
      console.log(`[Client v${CLIENT_VERSION}] Non-iOS device detected. Deferring to service worker.`);
      // The service worker will show the notification
      // This prevents duplicates by letting only one component handle it
      return;
    }
    
    // For iOS: Handle the notification here since SW might not work well on iOS
    console.log(`[Client v${CLIENT_VERSION}] iOS device detected. Client will handle notification.`);
    
    // Extract notification data
    const title = payload.notification?.title || payload.data?.title || "New Notification";
    const body = payload.notification?.body || payload.data?.body || "";
    const link = payload.fcmOptions?.link || payload.data?.link || '/';
    const image = payload.data?.image || payload.notification?.image;
    
    // Cast to any to allow for custom notification properties
    // The Notification API accepts these properties but TypeScript definitions are incomplete
    const notificationOptions: any = {
      body,
      // Use exact same icon path as Vite project
      icon: `/ic_stat_barber_1024/res/drawable-xxxhdpi/ic_stat_barber_1024.png`,
      badge: `/ic_stat_barber_1024/res/drawable-xxxhdpi/ic_stat_barber_1024.png`,
      tag: notificationId, // Use tag to prevent duplicates
      data: { 
        url: link,
        notificationId,
        fromClient: true, // Flag to identify source
        clientVersion: CLIENT_VERSION
      },
      requireInteraction: false, // On iOS, don't require interaction
      silent: true, // Keep notifications silent on iOS
      renotify: false
    };

    if (image) {
      notificationOptions.image = image;
    }

    console.log(`[Client v${CLIENT_VERSION}] Creating foreground notification with options:`, notificationOptions);
    
    // Create and show the notification
    const notification = new Notification(title, notificationOptions);
    
    // Add click handler directly to the notification
    notification.onclick = function(event) {
      event.preventDefault();
      console.log(`[Client v${CLIENT_VERSION}] Notification clicked, navigating to:`, link);
      window.open(link, '_blank');
    };
  });
};

export { app, messaging };
