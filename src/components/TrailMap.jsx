import React, { useState, useEffect, useRef } from 'react';
// import L from "leaflet";
// import { VectorGrid } from 'leaflet.vectorgrid';
import { MapContainer, TileLayer, LayersControl, Polyline } from 'react-leaflet'

import HeightProfile from './HeightProfile/HeightProfile';
import TrailPOI from './TrailPOI/TrailPOI';

import VectorTileLayer from './VectorTileLayer';

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

    const OPNVKarteApiKey = null
    const OPNVKarteURL = (OPNVKarteApiKey) 
        ? `https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=${OPNVKarteApiKey}` 
        : "https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png"

    const thunderApiKey = process.env.REACT_APP_THUNDERFOREST_API_KEY_1;
    const thunderURL = (thunderApiKey) 
        ? `https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=${thunderApiKey}` 
        : "https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?"

    const url =
        "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf";

   
        // const vectorTileOptions = {
    //     rendererFactory: L.canvas.tile,
    //     attribution: "Esri, HERE, Garmin, FAO, NOAA, USGS, EPA",
    // };

    return (
        <div>
            <MapContainer center={[43.174051999, 19.085094199]} style={{ height: "45vh" }} zoom={16} scrollWheelZoom={false}>

                {/* <TileLayer
                    attribution='🔠 &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                /> */}

                <LayersControl position="topright">
                    <LayersControl.BaseLayer name="Default" checked>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    </LayersControl.BaseLayer>
                    
                    <LayersControl.BaseLayer name="OpenTopoMap">
                        <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="CyclOSM">
                        <TileLayer url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png" />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Cycle Map">
                        <TileLayer url="http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png" />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="ArcGIS World Imagery">
                        <TileLayer
                            url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            attribution='Map data &copy; <a href="https://www.esri.com/en-us/home">ESRI</a>'
                        />
                    </LayersControl.BaseLayer>
                    
                    <LayersControl.BaseLayer name="ArcGIS Navigation">
                        <TileLayer
                            url="https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf"
                            attribution='Map data &copy; <a href="https://www.esri.com/en-us/home">ESRI</a>'
                        />
                    </LayersControl.BaseLayer>


                    <LayersControl.BaseLayer name="ArcGIS Topographic">
                        <TileLayer
                            url="https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}"
                            attribution='Map data &copy; <a href="https://www.esri.com/en-us/home">ESRI</a>'
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Humanitarian">
                        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="ÖPNVKarte">
                        <TileLayer url={OPNVKarteURL} />
                    </LayersControl.BaseLayer>
                    
                    <LayersControl.BaseLayer name="Transport Map">
                        <TileLayer url={thunderURL} />
                    </LayersControl.BaseLayer>

                    
                    <LayersControl.BaseLayer name="Esri WorldTerrain">
                        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}" />
                    </LayersControl.BaseLayer>
                    
                    <LayersControl.BaseLayer name="Esri WorldStreetMap">
                        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" />
                    </LayersControl.BaseLayer>
                    
                    <LayersControl.BaseLayer name="Esri WorldShadedRelief">
                        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}" />
                    </LayersControl.BaseLayer>
                </LayersControl>
               

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