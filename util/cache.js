let caches = new Map();

function getCacheById(id, maxTime) {
	if (!caches.has(id)) {
		caches.set(id, {
			maxTime,
			data: new Map(),
		});
	}

	return caches.get(id);
}

let nextId = 0;

/**
 * @template {(...args: any[]) => any} T
 * @param {T} cacheFn
 * @param {number} maxTime
 * @returns {T}
 */
export function cache(cacheFn, maxTime = 60000) {
	let id = nextId++;

	return (...args) => {
		let cache = getCacheById(id);
		let key = JSON.stringify(args);

		let cacheRes = cache.data.get(key);
		if (cacheRes && Date.now() - cacheRes.timestamp < maxTime) return cacheRes.data;

		let data = cacheFn(...args);
		if (data instanceof Promise) data = data.then(d => {
			if (d?.__dontCache) {
				cacheObj.timestamp = 0;
			}
			return d;
		})

		let cacheObj = {
			timestamp: Date.now(),
			data,
		}
		cache.data.set(key, cacheObj);
		return data;
	};
}

export function dontCache(obj) {
	obj.__dontCache = true;
	return obj;
}

setInterval(() => {
	//TODO clear caches
}, 1000);
