import { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

Chart.register(...registerables);

function Graficas(props) {
    const { setRefreshCheckLogin, location, history } = props;
    const data = {
        labels: ["Estados Unidos", "México", "Italia", "Colombia", "España"],
        datasets: [{
            label: "Habitantes",
            backgroundColor: "rgb(0, 255, 0, 1)",
            borderColor: "black",
            borderWidth: 1,
            data: [327.16, 126.19, 60.43, 49.64, 46.72]
        }]
    };

    const opciones = {
        maintainAspectRatio: false,
        responsive: true
    };

    return (
        <>
            <div className='App' style={{ width: "100%", height: "500px" }}>
                <h2>Población en millones de habitantes</h2>
                <Bar data={data} />
            </div>
        </>
    );

}

export default Graficas;
