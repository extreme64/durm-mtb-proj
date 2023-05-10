// cache.js

let cache = {};

export const hasKey = (key) => {
    return cache.hasOwn(key)
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
    console.log("Elev. cache:", cache);
};
