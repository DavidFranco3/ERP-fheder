import { API_HOST } from "../utils/constants";
import {
ENDPOINTRegistroProduccion,
ENDPOINTListarProduccion,
ENDPOINTListarPaginandoProduccion,
ENDPOINTObtenerProduccion,
ENDPOINTObtenerNoProduccion,
ENDPOINTObtenerItemProduccion,
ENDPOINTEliminarProduccion,
ENDPOINTActualizarEstadoProduccion,
ENDPOINTActualizarProduccion,
ENDPOINTObtenerDatosProduccion,
ENDPOINTTotalProduccion,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra orden de compra
export async function registraProduccion(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroProduccion, data, config);
}

// Obten el total de registros de la colección
export async function totalProduccion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalProduccion, config);
}

// Para obtener todos los datos de una orden de compra
export async function obtenerProduccion(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerProduccion + `/${id}`, config);
}

// Para obtener los datos de una compra segun el folio
export async function obtenerDatosProduccion(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosProduccion + `/${folio}`, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerNumeroProduccion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoProduccion, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerItemProduccion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemProduccion, config);
}

// Para listar todas las órdenes de compra
export async function listarProduccion(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarProduccion, config);
}

// Lista las ordenes de compra paginándolas
export async function listarProduccionPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoProduccion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina órdenes de compra
export async function eliminaProduccion(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarProduccion + `/${id}`, config);
}

// Actualiza estado de una orden de compra
export async function cambiaStatusProduccion(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoProduccion + `/${id}`, data, config);
}

// Modifica datos de una orden de compra
export async function actualizaProduccion(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarProduccion + `/${id}`, data, config);
}