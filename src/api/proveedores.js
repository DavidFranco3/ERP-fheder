import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraProveedores,
    ENDPOINTListarProveedores,
    ENDPOINTListarProveedoresActivos,
    ENDPOINTObtenerProveedores,
    ENDPOINTEliminarProveedores,
    ENDPOINTActualizarProveedores,
    ENDPOINTDeshabilitaProveedores,
    ENDPOINTListarProveedoresPaginacion,
    ENDPOINTTotalProveedores
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";
export let nombreUsuario = "";
export let apellidosUsuario = "";

// Registra clientes
export async function registraProveedores(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraProveedores, data, config);
}

// Obten el total de registros de la colección
export async function totalProveedores() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalProveedores, config);
}

// Para obtener todos los datos del cliente
export async function obtenerProveedores(params) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerProveedores + `/${params}`, config);
}

// Para listar todos los clientes
export async function listarProveedores(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarProveedores +`/?sucursal=${sucursal}`, config);
}

// Para listar todos los clientes
export async function listarProveedoresActivos(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarProveedoresActivos +`/?sucursal=${sucursal}`, config);
}

// Lista los clientes paginandolos
export async function listarProveedoresPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarProveedoresPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina cliente fisicamente de la bd
export async function eliminaProveedores(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarProveedores + `/${id}`, config);
}

// Deshabilita el usuario
export async function deshabilitaProveedores(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTDeshabilitaProveedores + `/${id}`, data, config);
}

// Modifica datos del cliente
export async function actualizaProveedores(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarProveedores + `/${id}`, data, config);
}
