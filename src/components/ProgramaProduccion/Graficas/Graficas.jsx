import { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { map } from "lodash";
Chart.register(...registerables);

function Graficas(props) {
    const { listProgramaProduccion } = props;
    const [ordenesProduccion, setOrdenesProduccion] = useState([]);
    const [cantidadProducir, setCantidadProducir] = useState([]);
    useEffect(() => {
        let auxOP = [], auxProducir = [];
        map(listProgramaProduccion, (ordenes, index) => {
            auxOP.push(ordenes.folioOP);
            auxProducir.push(ordenes.ordenProduccion.cantidadFabricar);
        })
        setOrdenesProduccion(auxOP);
        setCantidadProducir(auxProducir);
    }, []);
    const data = {
        labels: ordenesProduccion,
        datasets: [{
            label: "Cantidad a producir",
            backgroundColor: "rgb(255, 128, 0)",
            borderColor: "black",
            borderWidth: 1,
            data: cantidadProducir
        },]
    };
    const opciones = {
        maintainAspectRatio: false,
        responsive: true
    };

    return (
        <>
            <div className='App' style={{ width: "100%", height: "500px" }}>
                <h2>Tabla de cumplimiento</h2>
                <Bar data={data} options={opciones} />
            </div>
        </>
    );
}

export default Graficas;
