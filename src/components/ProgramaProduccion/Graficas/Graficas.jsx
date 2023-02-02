import { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { map } from "lodash";
import { obtenerDatosProduccion } from "../../../api/produccion";

Chart.register(...registerables);

function Graficas(props) {
    const { listProgramaProduccion } = props;

    const [ordenesProduccion, setOrdenesProduccion] = useState([]);
    const [cantidadProducir, setCantidadProducir] = useState([]);
    const [resultados, setResultados] = useState([]);

    useEffect(() => {
        let auxOP = [], auxProducir = [];
        map(listProgramaProduccion, (ordenes, index) => {
            auxOP.push(ordenes.folioOP);
            auxProducir.push(ordenes.ordenProduccion.cantidadFabricar);
        })
        setOrdenesProduccion(auxOP);
        setCantidadProducir(auxProducir);
    }, []);

    useEffect(() => {
        try {
            let auxRes = [];
            map(listProgramaProduccion, (ordenes, index) => {
                obtenerDatosProduccion(ordenes.folioOP).then(response => {
                    const { data } = response;
                    console.log(data);
                    console.log(data.acumulado);
                    auxRes.push(data.acumulado);
                    console.log(auxRes)
                }).catch(e => {
                    console.log(e)
                })
            })
            setResultados(auxRes)
        } catch (e) {
            console.log(e)
        }
    }, []);

    console.log(resultados)
    console.log(cantidadProducir)
    console.log(ordenesProduccion)

    const data = {
        labels: ordenesProduccion,
        datasets: [{
            label: "Cantidad a producir",
            backgroundColor: "rgb(255, 128, 0)",
            borderColor: "black",
            borderWidth: 1,
            data: cantidadProducir
        },
        {
            label: "Cantidad producida",
            backgroundColor: "rgb(0, 0, 255)",
            borderColor: "black",
            borderWidth: 1,
            data: resultados
        }]
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
