import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, Polyline } from 'react-leaflet'
import HeightProfile from './HeightProfile/HeightProfile';

import Trail from "./Trail";


function TrailMap() {

    const options = [
        { color: 'orange' },
        { color: 'blue' },
        { color: 'green' }
    ]

    const [trails, setTrails] = useState([]);
    const [elevations, setElevations] = useState({});

    const formPolyline = (trail) => {
        const points = [];
        trail.points.forEach((point) => {
            points.push([point.position['lan'], point.position['lng']])
        });    
        return points;
    }

    //TODO: Function to fetch elevation data for a set of points
    const fetchElevationData = async (points) => {
        // console.log( points);
        // const latLngs = points.map(point => `${point[0]},${point[1]}`);
        // const cacheKey = latLngs.join(';');

        // Check if elevation data is already in cache
        // if (elevations[cacheKey]) {
        //     return elevations[cacheKey];
        // }

        // If not in cache, fetch elevation data from API
        try {
            // const response = await fetch(`https://api.example.com/elevation?points=${latLngs.join(',')}`);
            const data = points //await response.json();
            
            // // Update cache with fetched elevation data
            // setElevations(prevElevations => ({
                //     ...prevElevations,
                //     [cacheKey]: data
                // }));
         
            
            return data;
        } catch (error) {
            console.error('Failed to fetch elevation data', error);
        }
    };

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
                    setTrails(parsed.trails.map(
                        trail => {
                            setElevations(fetchElevationData(trail))
                            return formPolyline(trail)
                        })
                    );

                } catch (error) {
                    console.error('Failed: ', error);
                }
            });
    }, []);

    const getElevationForTrack = (trackID) => {
        return trails[trackID]
    }

    return (
        <div>
            <MapContainer center={[43.174251672, 19.080044199]} style={{ height: "45vh" }} zoom={14} scrollWheelZoom={false}>
                <TileLayer
                    attribution='🔠 &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {trails.map((trailData, index) => (
                    <div key={`trail-${index}`}>
                        <Trail
                            key={`trail-poly${index}`}
                            pathOptions={options[index]}
                            name={`Text${index}`}
                            trailData={trailData} >
                        </Trail>
                    </div>
                ))}
            </MapContainer>
            <button
                onClick={() => fetchElevationData(trails[0])} >
                    Sync
                </button>
            <HeightProfile
                graphData={getElevationForTrack(0)}
            />
        </div>
    );
}

export default TrailMap;

