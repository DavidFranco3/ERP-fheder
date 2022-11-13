import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroEstudioFactibilidad,
    ENDPOINTListarEstudioFactibilidad,
    ENDPOINTObtenerFolioActualEstudioFactibilidad,
    ENDPOINTListarPaginandoEstudioFactibilidad,
    ENDPOINTObtenerEstudioFactibilidad,
    ENDPOINTObtenerDatosEstudioFactibilidad,
    ENDPOINTEliminarEstudioFactibilidad,
    ENDPOINTActualizarEstudioFactibilidad,
    ENDPOINTTotalEstudioFactibilidad
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";


// Registro de un estudio de factibilidad
export async function registraEstudioFactibilidad(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroEstudioFactibilidad, data, config);
}

// Obten el total de registros de la colección
export async function totalEstudiosFactibilidad() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalEstudioFactibilidad, config);
}

// Listar todos los estudios de factibilidad
export async function listarEstudioFactibilidad(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarEstudioFactibilidad, config);
}

// Obtener el folio actual del estudio de factibilidad
export async function obtenerFolioActualEstudioFactibilidad() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioActualEstudioFactibilidad, config);
}

// Listar paginando todos los estudios de factibilidad
export async function listarPaginacionEstudioFactibilidad(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoEstudioFactibilidad + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Obtener todos los datos de un estudio de factibilidad segun el id proporcionado
export async function obtenerEstudioFactibilidad(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerEstudioFactibilidad + `/${id}`, config);
}

// Obtener todos los datos de un estudio de factibilidad segun el folio proporcionado
export async function obtenerDatosEstudioFactibilidad(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosEstudioFactibilidad + `/${folio}`, config);
}

// Eliminar un estudio de factibilidad
export async function eliminaEstudioFactibilidad(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarEstudioFactibilidad + `/${id}`, config);
}

// Actualizar un estudio de factibilidad
export async function actualizaEstudioFactibilidad(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstudioFactibilidad + `/${id}`, data, config);
}
