import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraProductosOV,
    ENDPOINTListarProductosOV,
    ENDPOINTObtenerProductosOV,
    ENDPOINTObtenerDatosProductosOV,
    ENDPOINTEliminarProductosOV,
    ENDPOINTActualizarProductosOV,
    ENDPOINTDeshabilitaProductosOV,
    ENDPOINTListarProductosOVPaginacion,
    ENDPOINTTotalProductosOV
} from "./endpoints";
import axios from 'axios';
import {getTokenApi} from "./auth";

// Registra usuarios
export async function registraProductosOV(data) {
    //console.log(data)

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraProductosOV, data, config);
}

// Para obtener todos los datos del usuario
export async function obtenerProductosOV(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerProductosOV + `/${params}`, config);
}

// Para obtener todos los datos del usuario
export async function obtenerDatosProductosOV(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosProductosOV + `/${params}`, config);
}

// Obten el total de registros de la colección
export async function totalProductosOV() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalProductosOV, config);
}

// Para listar todos los usuarios
export async function listarProductosOV(ordenVenta) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarProductosOV + `/?ordenVenta=${ordenVenta}`, config);
}

// Listar los usuarios paginandolos
export async function listarProductosOVPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarProductosOVPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina cliente fisicamente de la bd
export async function eliminaProductosOV(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarProductosOV + `/${id}`, config);
}

// Deshabilita el usuario
export async function deshabilitaProductosOV(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTDeshabilitaProductosOV + `/${id}`, data, config);
}

// Modifica datos del usuario
export async function actualizaProductosOV(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarProductosOV + `/${id}`, data, config);
}
