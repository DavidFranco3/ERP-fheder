import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraCatalogoProductos,
    ENDPOINTListarCatalogoProductos,
    ENDPOINTListarPaginandoCatalogoProductos,
    ENDPOINTObtenerCatalogoProductos,
    ENDPOINTObtenerPorNoInternoCatalogoProductos,
    ENDPOINTEliminarCatalogoProductos,
    ENDPOINTActualizarEstadoCatalogoProductos,
    ENDPOINTActualizarInfoCatalogoProductos,
    ENDPOINTListaCatalogoProductosObsoletos,
    ENDPOINTListaCatalogoProductosActivos,
    ENDPOINTTotalCatalogoProductos
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra productos
export async function registraCatalogoProductos(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraCatalogoProductos, data, config);
}

// Obten el total de registros de la colección
export async function totalCatalogoProductos() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalCatalogoProductos, config);
}

// Para obtener todos los datos del producto segun el id proporcionado
export async function obtenerProductoCatalogo(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerCatalogoProductos + `/${id}`, config);
}

// Para obtener todos los datos del producto segun el numero interno
export async function obtenerProductoPorNoInternoCatalogo(numerointerno) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerPorNoInternoCatalogoProductos + `/${numerointerno}`, config);
}

// Para listar todos los productos
export async function listarCatalogoProductos(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCatalogoProductos +`/?sucursal=${sucursal}`, config);
}

// Para listar los productos activos
export async function listarCatalogoProductosActivos(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListaCatalogoProductosActivos, config);
}

// Para listar los productos obsoletos
export async function listarCatalogoProductosObsoletos(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListaCatalogoProductosObsoletos, config);
}

// Lista los productos paginandolos
export async function listarCatalogoProductosPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoCatalogoProductos + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina productos
export async function eliminaProductosCatalogo(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarCatalogoProductos + `/${id}`, config);
}

// Cambia el estado de los productos
export async function cambiaEstadoProductosCatalogo(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoCatalogoProductos + `/${id}`, data, config);
}

// Modifica datos de los productos
export async function actualizaProductosCatalogo(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarInfoCatalogoProductos + `/${id}`, data, config);
}
