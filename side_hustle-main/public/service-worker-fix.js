// Service Worker Fix for Navigation Preload
self.addEventListener('fetch', event => {
  // Only handle navigation requests with preloadResponse
  if (event.request.mode === 'navigate' && event.preloadResponse) {
    // Properly handle the preloadResponse promise
    event.respondWith(
      (async () => {
        try {
          // Try to use the preloaded response first
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            console.log('[Service Worker] Using navigation preload response');
            return preloadResponse;
          }

          // If preload isn't available, fall back to network
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.error('[Service Worker] Navigation preload failed:', error);
          
          // Last resort - try fetching from network again
          try {
            return await fetch(event.request);
          } catch (fetchError) {
            console.error('[Service Worker] Network fetch failed:', fetchError);
            // Return a fallback response if everything fails
            return new Response('Navigation error. Please try again.', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          }
        }
      })()
    );
  }
  // For other requests, let the default handlers work
}); 