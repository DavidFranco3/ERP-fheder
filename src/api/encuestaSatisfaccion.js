import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroEncuestaSatisfaccion,
    ENDPOINTListarEncuestaSatisfaccion,
    ENDPOINTObtenerFolioActualEncuestaSatisfaccion,
    ENDPOINTListarPaginandoEncuestaSatisfaccion,
    ENDPOINTObtenerEncuestaSatisfaccion,
    ENDPOINTObtenerDatosEncuestaSatisfaccion,
    ENDPOINTEliminarEncuestaSatisfaccion,
    ENDPOINTActualizarEncuestaSatisfaccion,
    ENDPOINTTotalEncuestaSatisfaccion
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registro de encuestas de satisfacción
export async function registraEncuestaSatisfaccion(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroEncuestaSatisfaccion, data, config);
}

// Obten el total de registros de la colección
export async function totalEncuestaSatisfaccion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalEncuestaSatisfaccion, config);
}

// Listar todas las encuestas de satisfación
export async function listarEncuestasSatisfaccion(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarEncuestaSatisfaccion +`/?sucursal=${sucursal}`, config);
}

// Obtener el folio actual de las encuestas de satisfaccion
export async function obtenerFolioActualEncuestaSatisfaccion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioActualEncuestaSatisfaccion, config);
}

// Listar paginando las encuestas de satisfacción
export async function listarPaginacionEncuestaSatisfaccion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoEncuestaSatisfaccion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Obtener todos los datos de una encuesta de satisfacción segun el id
export async function obtenerEncuestaSatisfaccion(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerEncuestaSatisfaccion + `/${id}`, config);
}

// Obtener todos los datos de una encuesta de satisfacción segun el folio
export async function obtenerDatosEncuestaSatisfaccion(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosEncuestaSatisfaccion + `/${folio}`, config);
}

// Eliminar una encuesta de satisfaccion
export async function eliminaEncuestaSatisfaccion(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarEncuestaSatisfaccion + `/${id}`, config);
}

// Actualizar la información de una encuesta de satisfacción
export async function actualizaEncuestaSatisfaccion(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEncuestaSatisfaccion + `/${id}`, data, config);
}
