import { API_HOST } from "../utils/constants";
import {
ENDPOINTRegistroInspeccion,
ENDPOINTListarInspeccion,
ENDPOINTListarInspeccionActivo,
ENDPOINTListarPaginandoInspeccion,
ENDPOINTObtenerInspeccion,
ENDPOINTObtenerNoInspeccion,
ENDPOINTObtenerItemInspeccion,
ENDPOINTEliminarInspeccion,
ENDPOINTActualizarEstadoInspeccion,
ENDPOINTActualizarInspeccion,
ENDPOINTObtenerDatosInspeccion,
ENDPOINTTotalInspeccion,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra orden de compra
export async function registraInspeccion(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroInspeccion, data, config);
}

// Obten el total de registros de la colección
export async function totalInspeccion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalInspeccion, config);
}

// Para obtener todos los datos de una orden de compra
export async function obtenerInspeccion(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerInspeccion + `/${id}`, config);
}

// Para obtener los datos de una compra segun el folio
export async function obtenerDatosInspeccion(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosInspeccion + `/${folio}`, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerNumeroInspeccion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoInspeccion, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerItemInspeccion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemInspeccion, config);
}

// Para listar todas las órdenes de compra
export async function listarInspeccion(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarInspeccion +`/?sucursal=${sucursal}`, config);
}

// Para listar todas las órdenes de compra
export async function listarInspeccionActivo(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarInspeccionActivo +`/?sucursal=${sucursal}`, config);
}

// Lista las ordenes de compra paginándolas
export async function listarInspeccionPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoInspeccion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina órdenes de compra
export async function eliminaInspeccion(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarInspeccion + `/${id}`, config);
}

// Actualiza estado de una orden de compra
export async function cambiaStatusInspeccion(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoInspeccion + `/${id}`, data, config);
}

// Modifica datos de una orden de compra
export async function actualizaInspeccion(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarInspeccion + `/${id}`, data, config);
}