import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import BarChart from './BarChart';

function HeightProfile(trailData) {
    
    const labels = ['Point Name1', 'Point Name1', 'Point Name1', 'Point Name1', 'Point Name1', 'Point Name1', 'Point Name1']
    const values = [1500, 1453, 1333, 1340, 1290, 1240, 1210]
    
    const [data, setData] = useState([])
              
    useEffect(() => {
        setData( {
            title: 'Height',
            labels: labels,
            values: values,
            colors: ['#3cba9f', '#3cba9f', '#3cba9f', '#3cba9f', '#3cba9f', '#3cba9f', '#3cba9f'],
        });
    }, [])


    return (
        <div className="heightp-rofile">
            <BarChart data={data} />
        </div>
    );
}

export default HeightProfile;