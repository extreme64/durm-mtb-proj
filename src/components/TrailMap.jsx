import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Popup, Polyline } from 'react-leaflet'
import HeightProfile from './HeightProfile/HeightProfile';
import TrailPOI from './TrailPOI/TrailPOI';

import { fetchTrails, polyOptions, formPolyline, fetchElevationData, craftTrailHeightProfile } from "./Trail";
import { dumpCache, dumpCacheHits, insertKey, hasKey } from '../utils/cache';


function TrailMap() {

    const isPassedStartRun =  useRef(false)

    const defaultTrailIndex = 0

    const [trails, setTrails] = useState([]);
    const [polylines, setPolylines] = useState([])
    const [trailCurrent, setTrailCurrent] = useState(0);
    const [trailHeightProfile, setTrailHeightProfile] = useState()
    const [elevations, setElevations] = useState({});
    const [elevationsRequested, setElevationsRequested] = useState(false)

    const [cueUpPoints, setCueUpPoints] = useState([])

    const selectTrail = (index) => {
        setTrailCurrent(index);       
    }

    // TrailPOI marked position edited callback
    const handleTrailPOIChange = (trailIndex, index, newPosition) => {

        let trailUpdated = []

        setElevationsRequested(false)
        if(!hasKey(newPosition.lat, newPosition.lng)){
            setCueUpPoints(oldCues => [
                ...oldCues, [newPosition.lat, newPosition.lng]
            ])
        }else{
            console.log(dumpCacheHits());
        }

        setTrailCurrent(trailIndex)

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
        if (isPassedStartRun.current === true) return

        // FIXME: still multy calls
        if(!elevationsRequested) {

            fetchTrails().then(data => {

                try {
                    const parsed = JSON.parse(data.result)
                    setTrails(parsed)

                    parsed.trails.forEach(trail => {

                        // Add all trail points to the Cue
                        const newCues = formPolyline(trail)

                        // Add points int  the setcueUpPoints
                        setCueUpPoints(oldCues => [
                            ...oldCues, ...newCues
                        ])
                    })
                } catch (error) {
                    console.error('Failed: ', error);
                }
                setElevationsRequested(true)
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
        }

        isPassedStartRun.current = true
    }, [elevationsRequested]);

    // cueUpPoints updated
    useEffect(() => {
        if (cueUpPoints.length === 0) return;

        (async () => {
            const cuesData = await fetchElevationData(cueUpPoints);
            setElevations(prevElevations => ({
                ...prevElevations,
                ...cuesData
            }));
            setCueUpPoints([]);
        })();
    }, [cueUpPoints]);

    // elevations updated
    useEffect(() => {

        if (typeof elevations === "undefined") return
        if (typeof trails.trails === "undefined") return

        let updatedTrails = { ...trails };
        const newTrails = updatedTrails.trails.map(trail => {
            let updatedPoints = [...trail.points];
            for (const key in elevations) {

                // Fine a point in the trails, add a elevation to it
                const point = trail.points.find(p => p.position.lat === elevations[key].pointID.lat && p.position.lng === elevations[key].pointID.lng);
                if (point) {
                    point.elevation = elevations[key].elevation;
                    insertKey(
                        `elevation_${elevations[key].pointID.lat}_${elevations[key].pointID.lng}`, 
                        elevations[key].elevation
                    );  
                }
            };
            return { ...trail, points: updatedPoints };
        });

        // Update trails points
        updatedTrails.trails = newTrails;
        setTrails(updatedTrails);

    }, [elevations])

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

    }, [trailCurrent, trails.trails])


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
                onClick={() => fetchElevationData(trails[trailCurrent])}>
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