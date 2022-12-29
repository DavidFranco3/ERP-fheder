import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroReportesProduccion,
    ENDPOINTListarReportesProduccion,
    ENDPOINTListarPaginandoReportesProduccion,
    ENDPOINTObtenerReportesProduccion,
    ENDPOINTObtenerNoReportesProduccion,
    ENDPOINTEliminarReportesProduccion,
    ENDPOINTActualizarReportesProduccion,
    ENDPOINTTotalReportesProduccion
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra un reporte de producción
export async function registraReporteProducción(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroReportesProduccion, data, config);
}

// Obten el total de registros de la colección
export async function totalReportesProduccion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalReportesProduccion, config);
}

// Para obtener todos los datos de un reporte de producción
export async function obtenerReporteProduccion(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerReportesProduccion + `/${id}`, config);
}

// Para obtener el número de orden de producción actual
export async function obtenerNumeroReporteProduccion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoReportesProduccion, config);
}

// Para listar todos los reportes de producción
export async function listarReportesProduccion(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarReportesProduccion +`/?sucursal=${sucursal}`, config);
}

// Lista los reportes de producción paginándolos
export async function listarReportesProduccionPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoReportesProduccion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina reportes de producción
export async function eliminaReportesProduccion(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarReportesProduccion + `/${id}`, config);
}

// Modifica datos de un Reporte de Produción
export async function actualizaReporteProduccion(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarReportesProduccion + `/${id}`, data, config);
}
