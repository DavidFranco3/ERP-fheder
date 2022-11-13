import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroProveedores,
    ENDPOINTListarProveedores,
    ENDPOINTListarPaginandoProveedores,
    ENDPOINTObtenerProveedores,
    ENDPOINTObtenNoActualProveedores,
    ENDPOINTEliminarProveedores,
    ENDPOINTDeshabilitarProveedores,
    ENDPOINTActualizarProveedores,
    ENDPOINTObtenerItemProveedor,
    ENDPOINTTotalProveedores
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra proveedores
export async function registraProveedores(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroProveedores, data, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerItem() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemProveedor, config);
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

// Para obtener todos los datos del proveedor
export async function obtenerProveedores(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerProveedores + `/${id}`, config);
}

// Obtener el numero de folio actual del proveedor
export async function obtenerFolioActualProveedores() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenNoActualProveedores, config);
}

// Para listar todos los proveedores
export async function listarProveedores(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarProveedores, config);
}

// Lista los proveedores paginandolos
export async function listarProveedoresPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoProveedores + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina proveedores
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

// Deshabilita a proveedores
export async function deshabilitaProveedores(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTDeshabilitarProveedores + `/${id}`, data, config);
}

// Modifica datos del proveedor
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
