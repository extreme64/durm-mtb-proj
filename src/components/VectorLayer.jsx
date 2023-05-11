import React from 'react';
import { useMap } from 'react-leaflet';
import { VectorGrid } from 'leaflet.vectorgrid';

const VectorTileLayer = ({ url }) => {
    const map = useMap();

    React.useEffect(() => {
        const vectorTileOptions = {
            vectorTileLayerStyles: {
                sliced: () => ({
                    weight: 1,
                    fillColor: 'red',
                    color: 'red',
                    fillOpacity: 1,
                }),
            },
        };
        const vectorTileLayer = new VectorGrid.protobuf(url, vectorTileOptions);
        vectorTileLayer.addTo(map);

        return () => {
            map.removeLayer(vectorTileLayer);
        };
    }, [map, url]);

    return null;
};

export default VectorTileLayer;
