// define global constants for service worker
const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

// define the files to be cached by the service worker
const FILES_TO_CACHE = [
	"./css/styles.css",
	"./js/idb.js",
	"./js/index.js",
	"./index.html",
];

self.addEventListener("install", function (e) {
	e.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			console.log(`installing cache : ` + CACHE_NAME);
			return cache.addAll(FILES_TO_CACHE);
		})
	);
});

self.addEventListener("activate", function (e) {
	e.waitUntil(
		caches.keys().then(function (keyList) {
			let cacheKeeplist = keyList.filter(function (key) {
				return key.indexOf(APP_PREFIX);
			});
			cacheKeeplist.push(CACHE_NAME);

			return Promise.all(
				keyList.map(function (key, i) {
					if (cacheKeeplist.indexOf(key) === -1) {
						console.log("deleting cache : " + keyList[i]);
						return caches.delete(keyList[i]);
					}
				})
			);
		})
	);
});