import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroExistenciasAlmacen,
    ENDPOINTListarExistenciasAlmacen,
    ENDPOINTListarPaginandoExistenciasAlmacen,
    ENDPOINTObtenerExistenciasAlmacen,
    ENDPOINTObtenerDatosExistenciasAlmacen,
    ENDPOINTEliminarExistenciasAlmacen,
    ENDPOINTActualizarExistenciasAlmacen,
    ENDPOINTTotalExistenciasAlmacen
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra existencias en almacen
export async function registraExistenciasAlmacen(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroExistenciasAlmacen, data, config);
}

// Obten el total de registros de la colección
export async function totalExistenciasAlmacen() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalExistenciasAlmacen, config);
}

// Para obtener todos los datos de una existencia en el almacen
export async function obtenerExistenciaAlmacen(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerExistenciasAlmacen + `/${id}`, config);
}

// Para obtener los datos de una existencia en almacen segun la clave
export async function obtenerDatosExistenciaAlmacen(clave) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosExistenciasAlmacen + `/${clave}`, config);
}

// Para listar todas las existencias del alamcen
export async function listarExistenciasAlmacen(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarExistenciasAlmacen +`/?sucursal=${sucursal}`, config);
}

// Listar las existencias del almacen paginandolos
export async function listarExistenciasAlmacenPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoExistenciasAlmacen + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina existencias del almacen
export async function eliminaExistenciasAlmacen(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarExistenciasAlmacen + `/${id}`, config);
}

// Modifica datos de existencias en el almacen
export async function actualizaExistenciasAlmacen(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarExistenciasAlmacen + `/${id}`, data, config);
}
