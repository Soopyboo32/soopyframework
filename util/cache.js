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
export function cache(cacheFn, maxTime = 60000) {
    let id = nextId++;

    return (...args) => {
        let cache = getCacheById(id);
        let key = JSON.stringify(args);

        let cacheRes = cache.data.get(key);
        if (cacheRes && Date.now() - cacheRes.timestamp < maxTime) return cacheRes.data;

        let data;
        cache.data.set(key, {
            timestamp: Date.now(),
            data: data = cacheFn(...args),
        });

        return data;
    };
}

setInterval(() => {
    //TODO clear caches
}, 1000);