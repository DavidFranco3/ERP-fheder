import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraCotizaciones,
    ENDPOINTListarCotizaciones,
    ENDPOINTListarPaginandoCotizaciones,
    ENDPOINTObtenNoCotizacion,
    ENDPOINTObtenerCotizaciones,
    ENDPOINTEliminarCotizaciones,
    ENDPOINTActualizarCotizaciones,
    ENDPOINTCambiarStatusCotizaciones,
    ENDPOINTTotalCotizaciones
} from "./endpoints";
import axios from 'axios';
import {getTokenApi} from "./auth";

// Registra cotizaciones
export async function registraCotizacion(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraCotizaciones, data, config);
}

// Obten el total de registros de la colección
export async function totalCotizaciones() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalCotizaciones, config);
}

// Para obtener todos los datos de la cotizacion
export async function obtenerCotizacion(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerCotizaciones + `/${params}`, config);
}

// Para obtener el numero de cotizacion actual
export async function obtenerNumeroCotizacion(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenNoCotizacion, config);
}

// Para listar todos las cotizaciones
export async function listarCotizacion(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCotizaciones, config);
}

// Listar las cotizaciones paginandolas
export async function listarCotizacionPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoCotizaciones + `?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina cotizacion
export async function eliminaCotizacion(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarCotizaciones + `/${id}`, config);
}

// Para actualizar el status de la cotización
export async function cambiaStatusCotizacion(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTCambiarStatusCotizaciones + `/${id}`, data, config);
}

// Modifica datos de la cotizacion
export async function actualizaCotizacion(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarCotizaciones + `/${id}`, data, config);
}
