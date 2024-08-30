const version = '2.0.0'
self.addEventListener('install', event => {
  console.log('ServiceWorker: Installed version ', version)
  // TODO: Cache resources needed to start
  /**
   * Cache assets when installing the service worker.
   *
   * @returns{Promise} Promise that resolves to undefined.
   */
  const cacheAssets = async () => {
    const cache = await self.caches.open(version)
    console.log('ServiceWorker: Caching Files')
    return cache.addAll([
      'index.html',
      'images/bliss.jpg',
      'images/chat.png',
      'images/memory.png',
      'images/note.png',
      'css/styles.css'
    ])
  }
  // Make sure to wait in "installing phase" until assets are cached.
  event.waitUntil(cacheAssets())
})

/**
 * Removes catched assets.
 */
const removeCachedAssets = async () => {
  const cacheKeys = await self.caches.keys()
  return Promise.all(
    cacheKeys.map(cache => {
      if (cache !== version) {
        console.info('ServiceWorker: Clearing Cache', cache)
        return self.caches.delete(cache)
      }
      return undefined
    })
  )
}
self.addEventListener('activate', event => {
  console.log('ServiceWorker: Activated version', version)
  event.waitUntil(removeCachedAssets())
})

// eslint-disable-next-line jsdoc/require-description
/**
 * Catch while fetch.
 * @param request ...
 */
const cachedFetch = async request => {
  try {
  // Try to fetch the asset from the server and if success, clone the result.
    const response = await fetch(request)
    if (!response.ok) {
      throw new Error('Network response was not ok.')
    }
    // Save the result in the cache
    const cache = await self.caches.open(version)
    cache.put(request, response.clone())
    return response
  } catch (error) {
    console.info('ServiceWorker: Serving cached result')
    return self.caches.match(request)
  }
}
self.addEventListener('fetch', event => {
  console.info('ServiceWorker: Fetching')
  event.respondWith(cachedFetch(event.request))
})
self.addEventListener('message', event => {
  console.log('ServiceWorker: Got a message')
// TODO: Handle events from the main application
})
self.addEventListener('push', event => {
  console.log('ServiceWorker: Got a push message from the server')
// TODO: Show a notification for the user
})
