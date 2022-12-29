import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroOrdenProduccion,
    ENDPOINTListarOrdenProduccion,
    ENDPOINTObtenerFolioActualOrdenProduccion,
    ENDPOINTListarPaginandoOrdenProduccion,
    ENDPOINTObtenerOrdenProduccion,
    ENDPOINTObtenerDatosOrdenProduccion,
    ENDPOINTEliminarOrdenProduccion,
    ENDPOINTActualizarOrdenProduccion,
    ENDPOINTTotalOrdenProduccion
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";


// Registro de ordenes de produccion
export async function registraOrdenProduccion(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroOrdenProduccion, data, config);
}

// Obten el total de registros de la colección
export async function totalOrdenProduccion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalOrdenProduccion, config);
}

// Listar todas las ordenes de producción
export async function listarOrdenesProduccion(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarOrdenProduccion +`/?sucursal=${sucursal}`, config);
}

// Obtener el folio actual de la orden de producción
export async function obtenerFolioActualOrdenProduccion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioActualOrdenProduccion, config);
}

// Listar paginando las ordenes de producción
export async function listarPaginacionOrdenProduccion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoOrdenProduccion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Obtener todos los datos de una orden de producción segun el id
export async function obtenerOrdenProduccion(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerOrdenProduccion + `/${id}`, config);
}

// Obtener todos los datos de una orden de producción segun el numero interno
export async function obtenerDatosOrdenProduccion(noInterno) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosOrdenProduccion + `/${noInterno}`, config);
}

// Eliminar una orden de producción
export async function eliminaOrdenProduccion(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarOrdenProduccion + `/${id}`, config);
}

// Actualizar los datos de una orden de producción
export async function actualizaOrdenProduccion(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarOrdenProduccion + `/${id}`, data, config);
}


