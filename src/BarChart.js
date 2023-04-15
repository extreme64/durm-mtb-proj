import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function BarChart({ data }) {
    const chartRef = useRef(null);

    useEffect(() => {
        const chart = new Chart(chartRef.current, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: data.title,
                        data: data.values,
                        backgroundColor: data.colors,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        return () => {
            chart.destroy();
        };
    }, [data]);

    return <canvas style={{ maxHeight: "40vh" }} ref={chartRef} />;
}

export default BarChart;