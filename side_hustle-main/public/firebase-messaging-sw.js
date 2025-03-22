// Import service worker fix for navigation preload
importScripts("./service-worker-fix.js");

// Self-registration for the service worker
self.addEventListener('install', function(event) {
  console.log('[firebase-messaging-sw.js] Service Worker installed');
  self.skipWaiting(); // Ensure the service worker activates immediately
});

// Handle service worker activation
self.addEventListener('activate', function(event) {
  console.log('[firebase-messaging-sw.js] Service Worker activated');
  event.waitUntil(self.clients.claim()); // Take control of all clients
});

// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: "AIzaSyB0Nxf3pvW32KBc0D1o2-K6qIeKovhGWfg",
  authDomain: "new1-f04b3.firebaseapp.com",
  projectId: "new1-f04b3",
  storageBucket: "new1-f04b3.firebasestorage.app",
  messagingSenderId: "802463638703",
  appId: "1:802463638703:web:bd0bbdaf3407d784d5205a",
  measurementId: "G-3RZEW537LN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Get the base URL for assets
const baseUrl = self.location.origin;

// Helper function to validate image URLs
function isValidImageUrl(url) {
  if (!url || url === 'undefined' || url === '') return false;
  
  // Allow relative URLs
  if (url.startsWith('/')) return true;
  
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

// Track processed notification IDs to prevent duplicates
const processedNotifications = new Set();

// Service worker version - used for logging
const SW_VERSION = '2.3.0';

// Set a timeout for clearing the processed notifications set to avoid memory leaks
setTimeout(() => {
  processedNotifications.clear();
  console.log(`[SW v${SW_VERSION}] Cleared processed notifications set after timeout`);
}, 1000 * 60 * 60); // Clear after 1 hour

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(`[SW v${SW_VERSION}] Received background message`, payload);
  
  // Extract notification ID to prevent duplicates
  const notificationId = payload.messageId || payload.collapseKey || Date.now().toString();
  
  // Skip if we've already processed this notification
  if (processedNotifications.has(notificationId)) {
    console.log(`[SW v${SW_VERSION}] Skipping duplicate notification ${notificationId}`);
    return;
  }
  
  // Check for iOS - handle differently based on device
  const userAgent = self.navigator ? self.navigator.userAgent : '';
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  console.log(`[SW v${SW_VERSION}] Device detection - iOS: ${isIOS}, Android: ${isAndroid}, UA: ${userAgent.substring(0, 50)}...`);
  
  // Add to processed set
  processedNotifications.add(notificationId);
  console.log(`[SW v${SW_VERSION}] Added notification ${notificationId} to processed set. Total: ${processedNotifications.size}`);
  
  // Clear old notification IDs (keep set small)
  if (processedNotifications.size > 20) {
    const oldestId = processedNotifications.values().next().value;
    processedNotifications.delete(oldestId);
    console.log(`[SW v${SW_VERSION}] Removed oldest notification ${oldestId} from processed set`);
  }
  
  // Extract notification data
  const title = payload.notification?.title || payload.data?.title || "New Notification";
  const body = payload.notification?.body || payload.data?.body || "You have a new notification";
  const link = payload.fcmOptions?.link || payload.data?.link || '/';
  const image = payload.data?.image || payload.notification?.image;
  
  // Use the correct icon paths from only_these folder
  const notificationOptions = {
    body,
    // Use larger icon for Android and apple icon for others
    icon: isAndroid ? 
      `${baseUrl}/only_these/android/android-launchericon-96-96.png` : 
      `${baseUrl}/only_these/ios/apple-icon-180x180.png`,
    // Use larger badge icon for better visibility in status bar
    badge: `${baseUrl}/only_these/android-icon-96x96.png`,
    data: { 
      url: link,
      ...payload.data,
      // Store notification ID to prevent duplicates later
      notificationId,
      fromServiceWorker: true, // Flag to identify source
      swVersion: SW_VERSION
    },
    // Use notification ID as tag to prevent duplicate system notifications
    tag: notificationId,
    renotify: false,
    requireInteraction: !isIOS,
    silent: isIOS, // Keep notifications silent on iOS
    actions: [
      {
        action: 'open',
        title: 'Open',
        icon: `${baseUrl}/only_these/android-icon-96x96.png`
      }
    ]
  };

  // Add image if valid
  if (isValidImageUrl(image)) {
    notificationOptions.image = image;
    console.log(`[SW v${SW_VERSION}] Adding image to notification:`, image);
  }

  console.log(`[SW v${SW_VERSION}] Creating notification with options:`, notificationOptions);
  return self.registration.showNotification(title, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log(`[SW v${SW_VERSION}] Notification clicked`, event);
  event.notification.close();
  
  // Get the URL from the notification data
  const url = event.notification.data?.url || '/';
  console.log(`[SW v${SW_VERSION}] Notification click - opening URL: ${url}`);
  
  // Handle action clicks
  if (event.action === 'open') {
    console.log(`[SW v${SW_VERSION}] Open action clicked`);
  }
  
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Try to focus an existing window with matching URL if found
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            console.log(`[SW v${SW_VERSION}] Focusing existing window with URL: ${url}`);
            return client.focus();
          }
        }
        
        // If no matching window, find any available window and navigate
        for (const client of clientList) {
          if ('focus' in client && 'navigate' in client) {
            console.log(`[SW v${SW_VERSION}] Navigating existing window to: ${url}`);
            return client.focus().then(() => client.navigate(url));
          }
        }
        
        // Otherwise open a new window
        if (clients.openWindow) {
          console.log(`[SW v${SW_VERSION}] Opening new window with URL: ${url}`);
          return clients.openWindow(url);
        }
      })
      .catch(err => {
        console.error(`[SW v${SW_VERSION}] Error handling notification click:`, err);
      })
  );
});

// Add explicit push event listener to prevent browser from showing its own notification
self.addEventListener('push', (event) => {
  console.log(`[SW v${SW_VERSION}] Push event received but letting Firebase handle it`);
  // Let Firebase's onBackgroundMessage handle it
  // This prevents the browser from showing its own notification
});
