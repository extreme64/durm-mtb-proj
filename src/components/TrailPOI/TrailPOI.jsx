import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Marker, Popup } from 'react-leaflet'
import styled from 'styled-components';

import CustomIcon from "./CustomIcon";


import { getCache, setCache, updateCache, dumpCache } from '../../utils/cache';

function TrailPOI(props) {
    const center = {
        lat: props.position[0],
        lng: props.position[1],
    };
    const [position, setPosition] = useState(center);
    const [elevation, setElevation] = useState(0)
    const [draggable, setDraggable] = useState(false);
    const markerRef = useRef(null);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPosition = marker.getLatLng();
                    setPosition(newPosition);
                    props.onPositionChange(newPosition, props.id); // Trigger the callback function with the new position
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

    const icon = CustomIcon({ iconType: 'pinS1t1', iconSize: [64, 64] });

    return (
        <div>
            <Marker
                ref={markerRef}
                draggable={draggable} 
                eventHandlers={eventHandlers} 
                position={position}
                autoPan={true}
                opacity={props.opacity}
                icon={icon}>
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