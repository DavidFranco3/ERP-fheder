import { API_HOST } from "../utils/constants";
import {
ENDPOINTRegistroLiberacionProducto,
ENDPOINTListarLiberacionProducto,
ENDPOINTListarPaginandoLiberacionProducto,
ENDPOINTObtenerLiberacionProducto,
ENDPOINTObtenerNoLiberacionProducto,
ENDPOINTObtenerItemLiberacionProducto,
ENDPOINTEliminarLiberacionProducto,
ENDPOINTActualizarEstadoLiberacionProducto,
ENDPOINTActualizarLiberacionProducto,
ENDPOINTObtenerDatosLiberacionProducto,
ENDPOINTTotalLiberacionProducto,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra orden de compra
export async function registraLiberacionProducto(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroLiberacionProducto, data, config);
}

// Obten el total de registros de la colección
export async function totalLiberacionProducto() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalLiberacionProducto, config);
}

// Para obtener todos los datos de una orden de compra
export async function obtenerLiberacionProducto(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerLiberacionProducto + `/${id}`, config);
}

// Para obtener los datos de una compra segun el folio
export async function obtenerDatosLiberacionProducto(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosLiberacionProducto + `/${folio}`, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerNumeroLiberacionProducto() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoLiberacionProducto, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerItemLiberacionProducto() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemLiberacionProducto, config);
}

// Para listar todas las órdenes de compra
export async function listarLiberacionProducto(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarLiberacionProducto, config);
}

// Lista las ordenes de compra paginándolas
export async function listarLiberacionProductoPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoLiberacionProducto + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina órdenes de compra
export async function eliminaLiberacionProducto(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarLiberacionProducto + `/${id}`, config);
}

// Actualiza estado de una orden de compra
export async function cambiaStatusLiberacionProducto(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoLiberacionProducto + `/${id}`, data, config);
}

// Modifica datos de una orden de compra
export async function actualizaLiberacionProducto(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarLiberacionProducto + `/${id}`, data, config);
}