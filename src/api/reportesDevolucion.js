import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroReporteDevoluciones,
    ENDPOINTListarReporteDevoluciones,
    ENDPOINTObtenerNoReporteDevoluciones,
    ENDPOINTListarpaginacionReporteDevoluciones,
    ENDPOINTObtenerReporteDevoluciones,
    ENDPOINTEliminarReporteDevoluciones,
    ENDPOINTTotalReporteDevoluciones
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra reporte de devoluciones
export async function registraReporteDevolucion(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroReporteDevoluciones, data, config);
}

// Obten el total de registros de la colección
export async function totalReporteDevoluciones() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalReporteDevoluciones, config);
}

// Para obtener todos los datos de un reporte de devolución
export async function obtenerReporteDevolucion(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerReporteDevoluciones + `/${id}`, config);
}

// Para obtener el número de reporte de devolución actual
export async function obtenerNumeroReporteDevolucion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoReporteDevoluciones, config);
}

// Para listar todos los reportes de devoluciones
export async function listarReportesDevolucion(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarReporteDevoluciones, config);
}

// Lista los reportes de devolución paginándolos
export async function listarDevolucionesPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarpaginacionReporteDevoluciones + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina reportes de devolución
export async function eliminaReportesDevolucion(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarReporteDevoluciones + `/${id}`, config);
}
