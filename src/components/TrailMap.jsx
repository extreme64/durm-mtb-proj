import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import  TrailPOI from "./TrailPOI";


function TrailMap() {
    const [count, setCount] = useState(0);
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

    // Define a function to generate random values for non-position properties
    function getRandomProperty() {
        const randDescription = ["This is a big road gap", "A nice spot for a picnic", "A tricky jump", "A steep climb"];
        const randWorkHours = [2, 3, 4, 5];
        const randIsPOI = [true, false];
        const randIsPolylinePoint = [true, false];

        return {
            description: randDescription[Math.floor(Math.random() * randDescription.length)],
            workHours: randWorkHours[Math.floor(Math.random() * randWorkHours.length)],
            isPOI: randIsPOI[Math.floor(Math.random() * randIsPOI.length)],
            isPolylinePoint: randIsPolylinePoint[Math.floor(Math.random() * randIsPolylinePoint.length)],
        };
    }

    useEffect(() => {
        document.title = `Count: ${count}`;
    }, [count]);

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

                    // multiPolyline3.forEach((pos, index) => {
                    //     const newPoint = {
                    //         name: `point${index + 1}`,
                    //         position: {
                    //             lan: pos[0],
                    //             lng: pos[1]
                    //         },
                    //         ...getRandomProperty()
                    //     };

                    //     parsed.trails.push(newPoint);
                    // });

                    // console.log(JSON.stringify(parsed.trails));
                } catch (error) {
                    console.error('Failed: ', error);
                }
            });
    }, []);

    

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

                {trails.map((trail, index) => (
                    <Polyline 
                        key={index}
                        pathOptions={options[index]} 
                        positions={trail} 
                        eventHandlers={{
                            click: () => {
                                alert('Polyline clicked')
                            },
                        }}>
                        <Popup>
                            A pretty Polyline popup. <br /> LimeOptions1 used to customise.
                        </Popup>
                    </Polyline>
                ))}
               
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

