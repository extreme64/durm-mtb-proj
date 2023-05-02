import React, { useState } from 'react';
import { Polyline } from 'react-leaflet';
import TrailPOI from './TrailPOI/TrailPOI';

export const polyOptions = [
    { color: 'orange' },
    { color: 'blue' },
    { color: 'green' }
]

export const fetchTrails = async () => {

    try {
        const response = await fetch("http://localhost:80/durm-mtb-proj/api/request_proxy.php?request_type=trails");
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Failed to fetch trails', error);
    }
};

export const formPolyline = (trail) => {
    const points = [];
    // console.log("formPolyline" , trail.points);
    trail.points.forEach((point) => {
        points.push([point.position['lat'], point.position['lng']])
    });
    return points;
}

// TODO: Function to fetch elevation data for a set of points
// TODO: Make with RETURN and no outside consts, move to trails.jsx
export const fetchElevationData = async (cPoints) => {

    let asked = false
    const doElevationRequesting = true
    // const pointToQuery = cueUpPoint
    const pointToQuery = cPoints

    if (pointToQuery.length === 0) return

    let batchRequestUrlString = ''
    pointToQuery.forEach(point => {
        batchRequestUrlString += `${point[0]},${point[1]}|`
    });

    try {
        // REST point to get elevetion for the ask point
        if (!doElevationRequesting) {
            // setElevations(Number(1781 + Math.random() * 10));
            return
        }

        const url = `http://localhost:80/durm-mtb-proj/api/request_proxy.php?request_type=elevation&points=${batchRequestUrlString}`;

        // Prevent free API error - 429 Too Many Requests
        if (asked) return
        fetch(url)
            .then((response) => response.json())
            .then((data) => {

                if (Array.isArray(data.result)) {
                    const reducedData = data.result.reduce((accum, value, index) => {
                        accum.push([index, value.elevation]);
                        return accum;
                    }, []);
                }

                // setElevations(prevElevations => ({
                //     ...prevElevations, ...reducedData
                // }));

            })
            .catch((error) => console.log(error));
        // console.log(elevations);

        // return data;
    } catch (error) {
        console.error('Failed to fetch elevation data', error);
    }
    asked = true
};

export const craftTrailHeightProfile = (trail) => {

    const labels = []
    const values = []

    // if (typeof trail === "undefined") return
    let pointsObj = new Map()
    trail.points.forEach((point, index) => {
        const lab = point.description
        const val = Number((1781 + Math.random() * 20) - (index*16))
        pointsObj.set(`index${index}`, {
            pointID: index,
            label: lab,
            value: val
        })
        labels.push(lab)
        values.push(val)

    })

    return {
        title: `${trail.name} - Height(m)`,
        labels: labels,
        values: values,
        colors: ['#3cba9f', '#3cba9f', '#3cba9f', '#3cba9f', '#3cba9f', '#3cba9f', '#3cba9f'],
    };
}
    
const Trail = ({ ...props }) => {
    
};

export default Trail;
