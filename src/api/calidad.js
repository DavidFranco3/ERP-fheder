import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroReportesCalidad,
    ENDPOINTListarReportesCalidad,
    ENDPOINTListarPaginandoReportesCalidad,
    ENDPOINTObtenerReportesCalidad,
    ENDPOINTObtenerNoReportesCalidad,
    ENDPOINTEliminarReportesCalidad,
    ENDPOINTActualizarReportesCalidad,
    ENDPOINTTotalReportesCalidad
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra reportes de calidad
export async function registraReporteCalidad(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroReportesCalidad, data, config);
}

// Obten el total de registros de la colección
export async function totalReporteCalidad() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalReportesCalidad, config);
}

// Para obtener todos los datos del reporte de calidad
export async function obtenerReporteCalidad(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerReportesCalidad + `/${id}`, config);
}

// Para obtener el numero de reporte actual
export async function obtenerNumeroReporteCalidad() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoReportesCalidad, config);
}

// Para listar todas los reportes
export async function listarReportesCalidad(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarReportesCalidad, config);
}

// Lista los reportes paginandolos
export async function listarReportesCalidadPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoReportesCalidad + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina reportes de calidad
export async function eliminaReportesCalidad(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarReportesCalidad + `/${id}`, config);
}

// Modifica datos de un reporte de calidad
export async function actualizaReportesCalidad(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarReportesCalidad + `/${id}`, data, config);
}
