import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import BarChart from './BarChart';

function HeightProfile(profileData) {
    
    const [data, setData] = useState([])
              
    useEffect(() => {

        if (typeof profileData.graphData === "undefined") return
        
        setData(profileData.graphData);

    }, [profileData])


    return (
        <div className="heightp-rofile">
            <BarChart data={data} />
        </div>
    );
}

export default HeightProfile;