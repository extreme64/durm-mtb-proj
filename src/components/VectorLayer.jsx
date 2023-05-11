// FIXME: remove or vault it

// import React, { useEffect, useRef } from 'react';

// import { MapContainer, TileLayer } from 'react-leaflet';
// import { useLeafletContext } from '@react-leaflet/core'
// import L from 'leaflet';
// import 'leaflet.vectorgrid';

// function VectorLayer({ name, url, vectorTileLayerStyles, ...props }) {
//     const context = useLeafletContext();


//     const vectorTileLayerStylesIn =
//     {
//         weight: 0.5,
//         opacity: 1,
//         color: '#ccc',
//         fillColor: '#390870',
//         fillOpacity: 0.6,
//         fill: true,
//         stroke: true
//     }
    

//     useEffect(() => {
//         if (context.map) {
//             const vectorGrid = L.vectorGrid.protobuf(url, {
//                 rendererFactory: L.canvas.tile,
//                 vectorTileLayerStyles: vectorTileLayerStylesIn,
//                 subdomains: "abcd",
//             }).addTo(context.map);

//             return () => {
//                 context.map.removeLayer(vectorGrid);
//             };
//         }
//     }, [context.map]);

//     return (
//         <TileLayer
//             {...props}
//             url={url}
//             attribution="222"
//             opacity={1}
//         />
//     );
// }

// export default VectorLayer;