import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'

import { getCache, setCache, updateCache, dumpCache } from './../utils/cache';

function TrailPOI() {
    const center = {
        lat: 43.174251672,
        lng: 19.080044199,
    };
    const [draggable, setDraggable] = useState(false);
    const [position, setPosition] = useState(center);
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPosition = marker.getLatLng();
                    setPosition(newPosition);
                    /* invalidate cache for the new position */
                    updateCache(`elevation_${newPosition.lat}_${newPosition.lng}`, null); 
                }
            },
        }),
        []
    );
    const toggleDraggable = useCallback(() => {
        setDraggable((d) => !d);
    }, []);

    const positionPreviewString = () => {
        const lat = Number(position.lat.toFixed(3));
        const lng = Number(position.lng.toFixed(3));
        return `Current Latlng: [${lat}...,${lng}...]`;
    };

    useEffect(() => {
 
        const cacheKey = `elevation_${position.lat}_${position.lng}`;
        const cachedElevation = getCache(cacheKey);
        const doElevationRequesting = false //TODO: Put flag 'doElevationRequesting' in .env
        let elevation

        /* Use cached elevation */
        if (cachedElevation !== undefined) {
            console.log('Cached elevation', cachedElevation);
            return; 
        }
        
        // REST point to get elevetion for the ask point
        if(!doElevationRequesting) {
            elevation = Number(1781 + Math.random()*10);
            console.log('Faux elevation', elevation);
            return
        }
        
        const url = `http://localhost:80/durm-mtb-proj/api/request_proxy.php?request_type=elevation&lat=${position.lat}&lng=${position.lng}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched data via. proxy', data.result);
                // TODO: elevations to a global store
                const elevation = data.result;
                setCache(cacheKey, elevation); // save elevation to cache
            })
            .catch((error) => console.log(error));

        dumpCache()

    }, [position]);

    return (
        <div>
            <Marker draggable={draggable} eventHandlers={eventHandlers} position={position} ref={markerRef}>
                <Popup minWidth={90}>
                    <span onClick={toggleDraggable}>
                        {draggable ? 'Draggable. ' + positionPreviewString() : 'Click to make marker draggable!'}
                    </span>
                </Popup>
            </Marker>
        </div>
    );
}

export default TrailPOI;