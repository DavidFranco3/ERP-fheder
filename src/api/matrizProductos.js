import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroMatrizProductos,
    ENDPOINTListarMatrizProductos,
    ENDPOINTListarActivosMatrizProductos,
    ENDPOINTListarObsoletosMatrizProductos,
    ENDPOINTListarPaginandoMatrizProductos,
    ENDPOINTObtenerMatrizProductos,
    ENDPOINTObtenerPorNoInternoMatrizProductos,
    ENDPOINTEliminarMatrizProductos,
    ENDPOINTActualizarEstadoMatrizProductos,
    ENDPOINTActualizarMatrizProductos,
    ENDPOINTTotalMatrizProductos
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra productos
export async function registraMatrizProductos(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroMatrizProductos, data, config);
}

// Obten el total de registros de la colección
export async function totalMatrizProductos() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalMatrizProductos, config);
}

// Para obtener todos los datos del producto segun el id especificado
export async function obtenerMatrizProducto(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerMatrizProductos + `/${id}`, config);
}

// Para obtener todos los datos del producto segun el numero interno especificado
export async function obtenerPorNoInternoMatrizProducto(numeroInterno) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerPorNoInternoMatrizProductos + `/${numeroInterno}`, config);
}

// Para listar todos los productos
export async function listarMatrizProductos(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarMatrizProductos +`/?sucursal=${sucursal}`, config);
}

// Para listar los productos activos
export async function listarMatrizProductosActivos(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarActivosMatrizProductos, config);
}

// Para listar los productos obsoletos
export async function listarMatrizProductosObsoletos(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarObsoletosMatrizProductos, config);
}

// Lista los productos paginandolos
export async function listarMatrizProductosPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoMatrizProductos + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina productos
export async function eliminaProductosMatriz(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarMatrizProductos + `/${id}`, config);
}

// Cambia el estado de los productos
export async function cambiaEstadoProductosMatriz(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoMatrizProductos + `/${id}`, data, config);
}

// Modifica datos de los productos
export async function actualizaProductosMatriz(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarMatrizProductos + `/${id}`, data, config);
}
