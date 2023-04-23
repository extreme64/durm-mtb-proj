import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import TrailPOI from "./TrailPOI/TrailPOI";
import CustomIcon from "./TrailPOI/CustomIcon";


function TrailMap() {

    const options = [
        { color: 'orange' },
        { color: 'blue' },
        { color: 'green' }
    ]

    const [trails, setTrails] = useState([]);

    const formPolyline = (trail) => {
        const points = [];
        trail.points.forEach((point) => {
            points.push([point.position['lan'], point.position['lng']])
        });    
        return points;
    }


    useEffect(() => {
        const fetchTrails = async () => {
            
            try {
                const response = await fetch("http://localhost:80/durm-mtb-proj/api/request_proxy.php?request_type=trails");
                const data = await response.json();
                return data;

            } catch (error) {
                console.error('Failed to fetch trails', error);
            }
        };
        fetchTrails()
            .then(data => {
                try {
                    const parsed = JSON.parse(data.result)
                    setTrails(parsed.trails.map(trail => formPolyline(trail)));
                } catch (error) {
                    console.error('Failed: ', error);
                }
            });
    }, []);


    const icon = CustomIcon({ iconType: 'pinS1t1', iconSize: [64, 64] });

    return (
        <div>
            <MapContainer center={[43.174251672, 19.080044199]} style={{ height: "45vh" }}  zoom={14} scrollWheelZoom={false}>
                <TileLayer
                    attribution='🔠 &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {trails.map((trail, index) => (
                    <div key={`trail-${index}`}>
                        <Polyline
                            key={`trail-poly${index}`}
                            pathOptions={options[index]}
                            positions={trail}
                            eventHandlers={{
                                click: () => {
                                    alert('Polyline clicked');
                                },
                            }}>
                            <Popup>
                                A pretty Polyline popup.<br /> LimeOptions1 used to customise.
                            </Popup>
                        </Polyline>
                        {trail.map((point, pIndex) => (
                            <TrailPOI 
                                key={`trailPOI-${index}-${pIndex}`} 
                                position={point}
                                opacity={0.7}
                                />
                        ))}
                    </div>        
                ))}
            </MapContainer>
        </div>
    );
}

export default TrailMap;

