
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

// REWORK: Chane the name to more generic, eg 'trailPoints'
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
export const fetchElevationData = async (pointToQuery) => {

    const doElevationRequesting = true

    if (typeof pointToQuery === 'undefined') return

    let batchRequestUrlString = ''
    pointToQuery.forEach(point => {
        batchRequestUrlString += `${point[0]},${point[1]}|`
    });

    try {

        // REST point to get elevetion for the ask point
        const url = `http://localhost:80/durm-mtb-proj/api/request_proxy.php?request_type=elevation&points=${batchRequestUrlString}`;
        
        if (!doElevationRequesting) {
            // TODO: create object for one ore more points requested. Pop elev. fith rand. value
            // - Number(1781 + Math.random() * 10));
            return
        }

        // Prevent free API error - 429 Too Many Requests
        return fetch(url)
            .then((response) => response.json())
            .then((data) => {

                if (Array.isArray(data.result)) {
                    const reducedData = data.result.reduce((accum, value, index) => {
                        accum.push({
                            "index":index, 
                            "pointID": {
                                "lat": value.location.lat, 
                                "lng": value.location.lng
                            }, 
                            "elevation": value.elevation
                        });
                        return accum;
                    }, []);
                    return reducedData
                }
            })
            .catch((error) => console.log(error));
    } catch (error) {
        console.error('Failed to fetch elevation data', error);
    }
};

export const craftTrailHeightProfile = (trail) => {

    if (typeof trail === "undefined") return
    
    const labels = []
    const values = []
    let pointsObj = new Map()
    
    trail.points.forEach((point, index) => {
        const lab = point.description
        const val = point.elevation
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
