import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.defaults.plugins.tooltip.enabled = false;

function Graficador(props) {
    const { indicador, status } = props;

    // labels: ["EN ORDEN DE VENTA", "EN PLANEACIÓN", "EN PRODUCCIÓN", "EN ALMACEN", "EN PLAN DE ENVIO", " EN RUTA DE ENVIO", "RECIBO DE PRODUCTOS"],

    // Define los dataset para cada uno de los estados, se contemplan 7 por ahora

    // Dataset para orden de venta
    const datasetOrdenVenta = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // Dataset para planeacion
    const datasetPlaneacion = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // Dataset para producción
    const datasetCompras = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // Dataset para almacen
    const datasetCalidad = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // Dataset para almacen
    const datasetAlmacenMP = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // Dataset para en plan de envio
    const datasetProduccion = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // Dataset para en ruta de envio
    const datasetAlmacenPT = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // Dataset para recibo de productos
    const datasetEmbarques = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // Dataset para recibo de productos
    const datasetFacturacion = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // Dataset para recibo de productos
    const datasetCuentasCobrar = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                ],
                borderColor: [
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                    "rgb(46, 139, 87)",
                ],
                borderWidth: 1,
            },
        ],
    }


    // Dataset cancelado -- grafica de pie completa
    const datasetCancelado = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)"
                ],
                borderColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // Clasificacion de datasets para cada estado
    // En orden de venta -- Dataset para cancelación
    const datasetOrdenVentaCancelado = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // En planeación -- Dataset para cancelación
    const datasetPlaneacionCancelado = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // En producción -- Dataset para cancelación -- Cancelado -- "rgb(255, 0, 0)",
    const datasetComprasCancelado = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // En almacen -- Dataset para cancelación
    const datasetCalidadCancelado = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // En plan de envio -- Dataset para cancelación
    const datasetProduccionCancelado = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // En ruta de envio -- Dataset para cancelación
    const datasetAlmacenCancelado = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // En recibo de productos -- Dataset para cancelación
    const datasetEmbarquesCancelado = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // En recibo de productos -- Dataset para cancelación
    const datasetFacturacionCancelado = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)"
                ],
                borderColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(230, 230, 250)"
                ],
                borderWidth: 1,
            },
        ],
    }

    // En recibo de productos -- Dataset para cancelación
    const datasetCuentasCobrarCancelado = {
        datasets: [
            {
                data: [51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4, 51.4],
                backgroundColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                ],
                borderColor: [
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                    "rgb(255, 0, 0)",
                ],
                borderWidth: 1,
            },
        ],
    }

    return (
        <>
            <Pie
                data={indicador === "1" ? datasetOrdenVenta : indicador === "2" ? datasetPlaneacion : indicador === "3" ? datasetCompras : indicador === "4" ? datasetCalidad : indicador === "5" ? datasetAlmacenMP : indicador === "6" ? datasetProduccion : indicador === "7" ?  datasetAlmacenPT : indicador === "8" ? datasetEmbarques : indicador === "9" ? datasetFacturacion : indicador === "10" ? datasetCuentasCobrar : datasetCancelado }
            />
        </>
    );
}

export default Graficador;
