import React, { useEffect, useRef } from 'react';

import { MapContainer, TileLayer } from 'react-leaflet';
import { useLeafletContext } from '@react-leaflet/core'
import L from 'leaflet';
import 'leaflet.vectorgrid';

function VectorLayer({ name, url, vectorTileLayerStyles, ...props }) {
    const context = useLeafletContext();

    const vectorTileLayerStylesIn = {
        sliced: {
            color: '#0000ff',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5,
            fillColor: '#0000ff'
        }
    }


    useEffect(() => {
        if (context.map) {
            const vectorGrid = L.vectorGrid.protobuf(url, {
                rendererFactory: L.canvas.tile,
                vectorTileLayerStylesIn,
                subdomains: "123",
            }).addTo(context.map);

            return () => {
                context.map.removeLayer(vectorGrid);
            };
        }
    }, [context.map]);

    return (
        <TileLayer
            {...props}
            url={url}
        />
    );
}

export default VectorLayer;


// import React, { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet.vectorgrid';
// import { MapContainer } from 'react-leaflet';

// const LeafletLayer = (props) => {
//     const { mapRef, children, ...rest } = props;
//     return (
//         <MapContainer {...rest} ref={mapRef}>
//             {children}
//         </MapContainer>
//     );
// };

// function VectorLayer({ name, url, vectorTileLayerStyles, ...props }) {
//     const mapRef = useRef(null);

//     console.log(mapRef);
//     useEffect(() => {
//         if (mapRef.current && mapRef.current.leafletElement) {
//             const vectorGrid = L.vectorGrid.protobuf(url, {
//                 rendererFactory: L.canvas.tile,
//                 vectorTileLayerStyles,
//             }).addTo(mapRef.current.leafletElement);

//             return () => {
//                 mapRef.current.leafletElement.removeLayer(vectorGrid);
//             };
//         }
//     }, [url, vectorTileLayerStyles]);

//     return (
//         <LeafletLayer mapRef={mapRef}>
//             <div ref={mapRef} />
//         </LeafletLayer>
//     );
// }

// export default VectorLayer;