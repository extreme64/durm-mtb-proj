// cache.js

let cache = {};

export const setCache = (key, value) => {
    cache[key] = value;
};

export const getCache = (key) => {
    return cache[key];
};

export const updateCache = (key, value) => {
    if (cache[key]) {
        cache[key] = value;
    }
};

export const clearCache = () => {
    cache = {};
};

export const dumpCache = () => {
    console.log(cache);
};
