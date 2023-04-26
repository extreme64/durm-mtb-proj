import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import BarChart from './BarChart';

function HeightProfile(trailData) {
    
    const labels = []
    const values = []
    
    const [data, setData] = useState([])
              
    useEffect(() => {
        
        const gData = trailData.graphData
        
        if (typeof gData === "undefined") return
        
        let pointsObj = new Map()
        gData.forEach((point, index) => {
            const lab = `Point${index}`
            const val = Number((1781 + Math.random() * 20) - (index*16))
            pointsObj.set(`index${index}`, {
                pointID: index,
                label: lab,
                value: val
            })
            labels.push(lab)
            values.push(val)

            // setElevations(prevElevations => ({
            //     ...prevElevations,
            // }));
        })
        console.log("pointsObj", pointsObj);

        setData( {
            title: 'Height(m)',
            labels: labels,
            values: values,
            colors: ['#3cba9f', '#3cba9f', '#3cba9f', '#3cba9f', '#3cba9f', '#3cba9f', '#3cba9f'],
        });

    }, [trailData])


    return (
        <div className="heightp-rofile">
            <BarChart data={data} />
        </div>
    );
}

export default HeightProfile;