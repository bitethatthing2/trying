// Script to handle tracking prevention warnings
(function() {
  // Create a proxy image loader
  window.proxyImageLoader = function(src, fallbackSrc) {
    const img = new Image();
    img.onerror = function() {
      console.warn('Image load error, using fallback:', src);
      this.src = fallbackSrc || '/only_these/logos/logo.png';
    };
    img.src = src;
    return img;
  };

  // Silence the specific -ms-high-contrast deprecation warnings
  const originalWarn = console.warn;
  
  // Override console.warn to filter out specific deprecation messages
  console.warn = function(...args) {
    // Check if the warning is about -ms-high-contrast
    if (args.length > 0 && 
        typeof args[0] === 'string' && 
        (args[0].includes('-ms-high-contrast') && args[0].includes('deprecated') ||
         args[0].includes('Google Maps JavaScript API') ||
         args[0].includes('google.maps'))) {
      // Silently ignore these specific warnings
      return;
    }
    
    // Pass other warnings through to the original console.warn
    return originalWarn.apply(console, args);
  };
  
  // Monitor for errors related to tracking prevention
  window.addEventListener('error', function(event) {
    if (event.message && 
        (event.message.includes('Tracking Prevention') || 
         event.message.includes('googleusercontent.com') ||
         event.message.includes('instagram.com') ||
         event.message.includes('google.com/maps') ||
         event.message.includes('maps.google.com'))) {
      console.info('Suppressed third-party resource error');
      event.preventDefault();
      return true;
    }
  }, true);

  // Helper for iframe loading
  window.ensureIframeLoads = function(iframe) {
    if (!iframe) return;
    
    // Force reload iframe if it doesn't load within a reasonable time
    const timeout = setTimeout(() => {
      const currentSrc = iframe.src;
      iframe.src = 'about:blank';
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 50);
    }, 3000);
    
    iframe.addEventListener('load', () => clearTimeout(timeout));
  };
  
  // Add helper for Google Maps iframes when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    const mapIframes = document.querySelectorAll('iframe[src*="google.com/maps"]');
    mapIframes.forEach(iframe => window.ensureIframeLoads(iframe));
  });
})(); 