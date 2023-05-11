import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.vectorgrid';
import { MapContainer } from 'react-leaflet';

const LeafletLayer = (props) => {
    const { children, ...rest } = props;
    return (
        <MapContainer {...rest}>
            {children}
        </MapContainer>
    );
};

export const VectorLayer = ({ url, vectorTileLayerStyles, ...props }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (mapRef.current) {
            const vectorGrid = L.vectorGrid.protobuf(url, {
                rendererFactory: L.canvas.tile,
                vectorTileLayerStyles,
            }).addTo(mapRef.current.leafletElement);

            return () => {
                mapRef.current.leafletElement.removeLayer(vectorGrid);
            };
        }
    }, [url, vectorTileLayerStyles]);

    return (
        <LeafletLayer {...props}>
            <div ref={mapRef} />
        </LeafletLayer>
    );
};
