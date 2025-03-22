// Android notification icon helper
// This script helps with setting up the small icon for Android notifications

// Function to get the appropriate notification icon path based on device
function getNotificationIconPath() {
  // For Android, use a PNG with transparency
  if (/Android/.test(navigator.userAgent)) {
    return '/only_these/android-icon-96x96.png';
  }
  
  // For iOS, use Apple icon
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    return '/only_these/ios/apple-icon-180x180.png';
  }
  
  // Default icon for other platforms
  return '/only_these/windows11/SmallTile.scale-400.png';
}

// Make function available globally
window.getNotificationIconPath = getNotificationIconPath;
