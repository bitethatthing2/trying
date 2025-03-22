# Troubleshooting Guide

This document provides solutions for common issues encountered with Firebase Cloud Messaging in this project.

## Common Issues

### Duplicate Notifications

**Symptoms:**
- Multiple notifications appear for a single message
- Both foreground and background notifications show simultaneously

**Solutions:**
1. Check the notification ID tracking in both `firebase-messaging-sw.js` and `firebase.ts`
2. Ensure the `processedNotifications` Set is working correctly
3. Verify that the service worker and client-side code are not both showing notifications
4. For iOS devices, make sure only the client-side handler is showing notifications

**Code to check:**
```javascript
// In firebase-messaging-sw.js
const processedNotifications = new Set();

// Check if notification has been processed
if (processedNotifications.has(notificationId)) {
  console.log(`Skipping duplicate notification ${notificationId}`);
  return;
}
```

### No Notifications Appear

**Symptoms:**
- FCM token is generated successfully
- API calls succeed but no notification appears

**Solutions:**
1. Check browser notification permissions (must be "granted")
2. Verify service worker registration in the console
3. For iOS devices, check if notifications are being blocked
4. Ensure the VAPID key is correctly configured
5. Check browser console for any errors

**Debugging steps:**
1. Open browser developer tools
2. Go to Application tab > Service Workers
3. Check if the service worker is registered and active
4. Look for errors in the Console tab

### Netlify Build Failures

**Symptoms:**
- Build fails with syntax errors
- Unescaped quotes causing JSX compilation errors

**Solutions:**
1. Replace all instances of apostrophes in JSX with `&apos;`
2. Check for other syntax errors in JSX code
3. Verify that all environment variables are set in Netlify UI

**Common error locations:**
- `app/page.tsx`
- `app/layout.tsx`
- Any component with text content containing apostrophes

### Service Worker Not Registering

**Symptoms:**
- "Failed to register service worker" error in console
- No background notifications

**Solutions:**
1. Ensure the service worker file is in the correct location (`public/firebase-messaging-sw.js`)
2. Check for JavaScript errors in the service worker file
3. For local development, make sure you're using HTTPS
4. Verify the scope is set correctly

**Code to check:**
```javascript
navigator.serviceWorker.register('/firebase-messaging-sw.js', {
  scope: '/'
}).then(registration => {
  console.log('Service worker registered with scope:', registration.scope);
}).catch(error => {
  console.error('Service worker registration failed:', error);
});
```

### iOS-Specific Issues

**Symptoms:**
- Notifications work on Android but not on iOS
- Service worker behaves differently on iOS

**Solutions:**
1. Ensure iOS-specific detection is working correctly
2. For iOS, handle notifications in client-side code, not service worker
3. Set `silent: true` for iOS notifications
4. Set `requireInteraction: false` for iOS

**Code to check:**
```javascript
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

if (isIOS) {
  // Handle notification in client code
  // ...
} else {
  // Let service worker handle it
}
```

### FCM Token Not Generated

**Symptoms:**
- `null` or empty token
- "Error fetching FCM token" messages

**Solutions:**
1. Check if the Firebase configuration is correct
2. Verify the VAPID key is properly formatted
3. Ensure notification permissions are granted
4. For development, check if using the development token

**Debugging steps:**
1. Add more detailed logging in the `fetchToken` function
2. Check the Firebase console for any issues with your project
3. Verify all required Firebase configuration values are set

### Incorrect Notification Icons

**Symptoms:**
- Default notification icon appears instead of custom icon
- Icon appears on some devices but not others

**Solutions:**
1. Ensure icon paths are correct and accessible
2. Provide icons in multiple resolutions
3. Use absolute URLs for icons in the service worker
4. Check icon format (PNG recommended)

**Code to check:**
```javascript
const notificationOptions = {
  body,
  icon: `${baseUrl}/ic_stat_barber_1024/res/drawable-xxxhdpi/ic_stat_barber_1024.png`,
  badge: `${baseUrl}/ic_stat_barber_1024/res/drawable-xxxhdpi/ic_stat_barber_1024.png`,
  // ...
};
```

## Advanced Troubleshooting

### Debugging Service Worker

1. **Enable Service Worker Logging:**
   - Open Chrome DevTools
   - Go to Application > Service Workers
   - Check "Update on reload" and "Bypass for network"
   - View console logs for the service worker

2. **Force Update Service Worker:**
   - In the Application tab, click "Unregister" for the service worker
   - Reload the page
   - The service worker should re-register

3. **Check Service Worker State:**
   ```javascript
   navigator.serviceWorker.getRegistrations().then(registrations => {
     console.log('Service Worker Registrations:', registrations);
   });
   ```

### Debugging Firebase Messaging

1. **Check Firebase Initialization:**
   ```javascript
   console.log('Firebase Apps:', firebase.getApps());
   ```

2. **Test FCM Token Generation:**
   ```javascript
   const messaging = firebase.messaging();
   messaging.getToken({ vapidKey: 'YOUR_VAPID_KEY' })
     .then(token => console.log('Token:', token))
     .catch(err => console.error('Error getting token:', err));
   ```

3. **Monitor Token Refresh:**
   ```javascript
   messaging.onTokenRefresh(() => {
     console.log('Token refreshed');
     // Get new token
     messaging.getToken().then(refreshedToken => {
       console.log('New token:', refreshedToken);
     });
   });
   ```

## Getting Help

If you continue to experience issues:

1. Check the [Firebase Cloud Messaging documentation](https://firebase.google.com/docs/cloud-messaging)
2. Review error messages in browser console and Netlify logs
3. Check for any Firebase console warnings or errors
4. Test with a simple notification payload first, then add complexity 