import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraAlmacen,
    ENDPOINTListarAlmacen,
    ENDPOINTObtenerAlmacen,
    ENDPOINTEliminarAlmacen,
    ENDPOINTActualizarAlmacen,
    ENDPOINTListarAlmacenPaginacion,
    ENDPOINTTotalAlmacen
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra articulo del almacen
export async function registraArticuloAlmacen(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraAlmacen, data, config);
}

// Obten el total de registros de la colección
export async function totalAlmacenMP() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalAlmacen, config);
}

// Para obtener todos los articulos del almacen
export async function obtenerArticuloAlmacen(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerAlmacen + `/${params}`, config);
}

// Para listar todos los articulos del almacen
export async function listarArticuloAlmacen(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarAlmacen +`/?sucursal=${sucursal}`, config);
}

// Lista los articulos del almacen paginando
export async function listarArticuloAlmacenPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarAlmacenPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina articulo del almacen
export async function eliminaArticuloAlmacen(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarAlmacen + `/${id}`, config);
}

// Modifica datos de articulos del almacen
export async function actualizaArticuloAlmacen(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarAlmacen + `/${id}`, data, config);
}
