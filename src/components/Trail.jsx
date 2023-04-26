import React, { useState } from 'react';
import { Polyline } from 'react-leaflet';
import TrailPOI from './TrailPOI/TrailPOI';

const Trail = ({ ...props }) => {
    const name = props.name
    const [selected, setSelected] = useState(false);
    const [positions, setPositions] = useState(props.trailData);

    const handleTrailPOIChange = (index, newPosition) => {
        // Update the position of the TrailPOI marker at the specified index
        setPositions((prevPositions) => {
            const newPositions = [...prevPositions];
            newPositions[index] = newPosition;
            return newPositions;
        });
    };

    const selectTrail = () => {
        setSelected(!selected);
        console.log("Selected trail -", name);
    }

    return (
        <>
            <Polyline 
                positions={positions}
                // pathOptions={{ color: selected ? "red" : "blue" }}
                pathOptions={props.pathOptions}
                onClick={selectTrail}
                eventHandlers={{
                    click: () => {
                        selectTrail();
                    },
                }} />

            {positions.map((position, index) => (
                <TrailPOI
                    key={index}
                    position={position}
                    onPositionChange={(newPosition) =>
                        handleTrailPOIChange(index, newPosition)
                    }
                />
            ))}
        </>
    );
};

export default Trail;
