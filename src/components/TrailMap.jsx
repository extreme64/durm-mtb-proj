import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, Polyline } from 'react-leaflet'
import HeightProfile from './HeightProfile/HeightProfile';
import TrailPOI from './TrailPOI/TrailPOI';

import { fetchTrails, polyOptions, formPolyline, fetchElevationData, craftTrailHeightProfile } from "./Trail";



function TrailMap() {

  
    const defaultTrailIndex = 0


    const [trails, setTrails] = useState([]);
    const [polylines, setPolylines] = useState([])
    const [trailCurrent, setTrailCurrent] = useState(0);
    const [trailHeightProfile, setTrailHeightProfile] = useState()
    const [elevations, setElevations] = useState({});
    // let asked = false

    const [cueUpPoint, setCueUpPoints] = useState([
        [43.1750786565768, 19.084473699409727],
        [43.17349202, 19.086744943999975]
    ])

    const selectTrail = (index) => {
        setTrailCurrent(index);       
    }

    // TODO: Function to fetch elevation data for a set of points
    // TODO: Make with RETURN and no outside consts, move to trails.jsx
    // const fetchElevationData = async (points) => {

    //     let asked = false


    //     const doElevationRequesting = true
    //     const pointToQuery = cueUpPoint

    //     if (pointToQuery.length === 0) return

    //     let batchRequestUrlString = ''
    //     pointToQuery.forEach(point => {
    //         batchRequestUrlString += `${point[0]},${point[1]}|`
    //     });

    //     try {
    //         // REST point to get elevetion for the ask point
    //         if (!doElevationRequesting) {
    //             setElevations(Number(1781 + Math.random() * 10));
    //             return
    //         }

    //         const url = `http://localhost:80/durm-mtb-proj/api/request_proxy.php?request_type=elevation&points=${batchRequestUrlString}`;

    //         // Prevent free API error - 429 Too Many Requests
    //         if (asked) return
    //         fetch(url)
    //             .then((response) => response.json())
    //             .then((data) => {

    //                 const reducedData = data.result.reduce((accum, value, index) => {
    //                     accum.push([index, value.elevation]);
    //                     return accum;
    //                 }, []);

    //                 // setElevations(prevElevations => ({
    //                 //     ...prevElevations, ...reducedData
    //                 // }));

    //             })
    //             .catch((error) => console.log(error));
    //         console.log(elevations);

    //         // return data;
    //     } catch (error) {
    //         console.error('Failed to fetch elevation data', error);
    //     }
    //     asked = true
    // };

    // TrailPOI marked position edited callback
    const handleTrailPOIChange = (trailIndex, index, newPosition) => {

        setTrailCurrent(trailIndex)

        let trailUpdated = []
        // console.log("How is sel:", trailIndex);

        setTrails(prevTrails => {
            const prevTrailsArray = prevTrails.trails;
            prevTrailsArray[trailIndex].points[index].position.lat = newPosition.lat;
            prevTrailsArray[trailIndex].points[index].position.lng = newPosition.lng;
            trailUpdated = prevTrailsArray[trailIndex]
            return { trails: prevTrailsArray };
        });

        setPolylines((oldPolies) => {
            const newPolies = [...oldPolies]; // create a new copy of the polylines array
            const updatedPolyline = formPolyline(trailUpdated);
            newPolies[trailIndex] = updatedPolyline; // replace the old polyline with the updated one
            return newPolies;
        })

    };

    // Get Trails data
    useEffect(() => {

        if (typeof trails.trails !== "undefined") return

        fetchTrails().then(data => {
            try {

                const parsed = JSON.parse(data.result)
                setTrails(parsed)

                parsed.trails.forEach(trail => {
                    // setElevations(fetchElevationData(trail));
                    const data = fetchElevationData(cueUpPoint)

                    setElevations(prevElevations => ({
                        ...prevElevations, ...data
                    }));
                })

            } catch (error) {
                console.error('Failed: ', error);
            }
        });

        // Polyline crafting at start
        if (trails.trails) {
            setPolylines((oldPolies) => {
                const newPolies = oldPolies
                trails.trails.forEach((trail) => {
                    newPolies.push(formPolyline(trail))
                })
                return newPolies
            })

            setTrailHeightProfile(craftTrailHeightProfile(trails.trails[trailCurrent]))
        }

    }, []);
    
    // Trails object change handling
    useEffect(() => {

        if (trails.trails) {
            setPolylines((oldPolies) => {
                const newPolies = []
                trails.trails.forEach((trail) => {
                    newPolies.push(formPolyline(trail))
                })
                return newPolies
            })
        }

    }, [trails.trails]);

    // Active trail change handling
    useEffect(() => {
        if (trails.trails && typeof trailCurrent !== 'undefined') {
            setTrailHeightProfile(craftTrailHeightProfile(trails.trails[trailCurrent]))
        }

    }, [trailCurrent])

 
    return (
        <div>
            <MapContainer center={[43.174051999, 19.085094199]} style={{ height: "45vh" }} zoom={16} scrollWheelZoom={false}>

                <TileLayer
                    attribution='🔠 &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {trails.trails &&
                    trails.trails.map((trailData, indexT) => (
                       

                        <div key={`trail-${indexT}`}>

                            {polylines[indexT] ?
                                <Polyline
                                    name={indexT}
                                    positions={polylines[indexT]}
                                    pathOptions={{ color: trailCurrent === indexT ? "#e99" : polyOptions[indexT].color }}
                                    // pathOptions={polyOptions[indexT]}
                                    eventHandlers={{
                                        click: () => {
                                            selectTrail(indexT);
                                        },
                                    }} /> : null}

                            {formPolyline(trails.trails[indexT]).map((position, index) => (
                                <TrailPOI
                                    key={index}
                                    id={`marker${index}`}
                                    position={position}
                                    onPositionChange={(newPosition) =>
                                        handleTrailPOIChange(indexT, index, newPosition)
                                    }
                                />
                            ))}

                        </div>

                    ))}

            </MapContainer>

            <button
                onClick={() => fetchElevationData(trails[0])}>
                Sync
            </button>

            <HeightProfile
                //FIXME: Needs to be a number not string
                graphData={trailHeightProfile}
            />

        </div>
    );
}

export default TrailMap;

