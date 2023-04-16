import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import  TrailPOI from "./TrailPOI";

function TrailMap() {
    const [count, setCount] = useState(0);
    const options1 = { color: 'orange' }
    const options2 = { color: 'blue' }
    const options3 = { color: 'green' }

    const multiPolyline1 = [
        [
            [43.174251672, 19.080044199],
            [43.174369102, 19.083708348],
            [43.174890876, 19.084173292],
            [43.174414113, 19.084914839],
            [43.173956457, 19.085725581],
            [43.173492020, 19.086744944],
            [43.174151592, 19.088966399],
            [43.173774490, 19.091266226],
            [43.173876917, 19.092538347],
            [43.172953734, 19.094952587],
            [43.171682283, 19.098714804],
            [43.171431413, 19.096261924],
            [43.168995464, 19.096286399],
            [43.167983685, 19.096867768],
            [43.166925050, 19.098236952],
            [43.166196914, 19.099146221],
            [43.165918635, 19.101901604],
            [43.164408049, 19.103642525],
        ]
    ]

    const multiPolyline2 = [
        [43.174251672, 19.080044198999985], 
        [43.174369102, 19.08370834799996], 
        [43.175047359854084, 19.084473699409727], 
        [43.174414113, 19.08491483900002], 
        [43.17395645700002, 19.085811411688496], 
        [43.17349202, 19.086744943999975], 
        [43.17396380857255, 19.088880568311538], 
        [43.17364930033946, 19.090965818590348], 
        [43.17243722282442, 19.09185170149226], 
        [43.17254686119686, 19.092935565820767],
        [43.17190088995291, 19.0945453102305], 
        [43.17043523930827, 19.09517060004987], 
        [43.168515788642495, 19.09806939763871], 
        [43.168427474390136, 19.09969607370408], 
        [43.167793257716106, 19.100948665457963], 
        [43.16666986419123, 19.102759910884743], 
        [43.16550361557406, 19.104243339819277],
    ]

    const multiPolyline3 = [
        [43.174251672, 19.080044198999985], 
        [43.174369102, 19.08370834799996], 
        [43.1750786565768, 19.084473699409727],
        [43.174414113, 19.08491483900002], 
        [43.17439461748531, 19.08598307306545],
        [43.17349202, 19.086744943999975], 
        [43.173118776003335, 19.087893515394057], 
        [43.172679071768954, 19.089850019640153], 
        [43.17174866143861, 19.091250886672924],
        [43.17085674515324, 19.09237766634567],
        [43.16952216954571, 19.09334368059183],
        [43.16824426340966, 19.093754393690006],
        [43.168359288052365, 19.0968248526558],
        [43.16827097357373, 19.099824819736796],
        [43.167605454738336, 19.101377818900346], 
        [43.16673246620682, 19.102674080196266],
        [43.16553491718748, 19.104286255163515],
    ]

    useEffect(() => {
        document.title = `Count: ${count}`;
    }, [count]);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        
            <MapContainer center={[43.174251672, 19.080044199]} style={{ height: "45vh" }}  zoom={14} scrollWheelZoom={false}>
                <TileLayer
                    attribution='🔠 &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <TrailPOI />
                <Polyline 
                    pathOptions={options1} 
                    positions={multiPolyline1} 
                    eventHandlers={{
                        click: () => {
                            alert('Polyline clicked')
                        },
                    }}>
                    <Popup>
                        A pretty Polyline popup. <br /> LimeOptions1 used to customise.
                    </Popup>
                </Polyline>
                <Polyline
                    pathOptions={options2}
                    positions={multiPolyline2}
                    eventHandlers={{
                        click: () => {
                            alert('Polyline clicked')
                        },
                    }}>
                    <Popup>
                        A pretty Polyline popup. <br /> LimeOptions2 used to customise.
                    </Popup>
                </Polyline>
                <Polyline
                    pathOptions={options3}
                    positions={multiPolyline3}
                    eventHandlers={{
                        click: () => {
                            alert('Polyline clicked')
                        },
                    }}>
                    <Popup>
                        A pretty Polyline popup. <br /> LimeOptions3 used to customise.
                    </Popup>
                </Polyline>

                <Marker position={[51.505, -0.09]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
           
        </div>
    );
}

export default TrailMap;

