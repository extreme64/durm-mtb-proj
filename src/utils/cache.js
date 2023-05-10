// cache.js

let cache = {};
let cacheHits = 0;

export const hasKey = (key) => {
    let keyInCache = false
    if (typeof cache === 'undefined') return keyInCache
    keyInCache = cache.hasOwnProperty(key)
    if (keyInCache) cacheHits++
    return keyInCache
}

export const getCache = (key) => {
    return cache[key];
};

export const setCache = (key, value) => {
    cache[key] = value;
};

export const updateCache = (key, value) => {
    if (cache[key]) {
        cache[key] = value;
    }
};

export const insertKey = (key, value) => {
    if (cache[key]) {
        updateCache(key, value)
    } else {
        setCache(key, value)
    }
}

export const clearCache = () => {
    cache = {};
};

export const dumpCache = () => {
    console.log("Cache:", cache);
};

export const dumpCacheHits = () => {
    console.log("Cache: hits", cacheHits);
};
