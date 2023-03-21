import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroEvaluacionProveedores,
    ENDPOINTListarEvaluacionProveedores,
    ENDPOINTListarPaginandoEvaluacionProveedores,
    ENDPOINTObtenerEvaluacionProveedores,
    ENDPOINTObtenNoActualEvaluacionProveedores,
    ENDPOINTEliminarEvaluacionProveedores,
    ENDPOINTDeshabilitarEvaluacionProveedores,
    ENDPOINTActualizarEvaluacionProveedores,
    ENDPOINTObtenerItemEvaluacionProveedor,
    ENDPOINTListarEvaluacionProveedoresActivos,
    ENDPOINTTotalEvaluacionProveedores
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra proveedores
export async function registraEvaluacionProveedores(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroEvaluacionProveedores, data, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerItemEvaluacionProveedor() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemEvaluacionProveedor, config);
}

// Obten el total de registros de la colección
export async function totalEvaluacionProveedores() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalEvaluacionProveedores, config);
}

// Para obtener todos los datos del proveedor
export async function obtenerEvaluacionProveedores(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerEvaluacionProveedores + `/${id}`, config);
}

// Obtener el numero de folio actual del proveedor
export async function obtenerFolioActualEvaluacionProveedores() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenNoActualEvaluacionProveedores, config);
}

// Para listar todos los proveedores
export async function listarEvaluacionProveedores(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarEvaluacionProveedores +`/?sucursal=${sucursal}`, config);
}

// Para listar todos los proveedores
export async function listarEvaluacionProveedoresActivos(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarEvaluacionProveedoresActivos +`/?sucursal=${sucursal}`, config);
}

// Lista los proveedores paginandolos
export async function listarEvaluacionProveedoresPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoEvaluacionProveedores + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina proveedores
export async function eliminaEvaluacionProveedores(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarEvaluacionProveedores + `/${id}`, config);
}

// Deshabilita a proveedores
export async function deshabilitaEvaluacionProveedores(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTDeshabilitarEvaluacionProveedores + `/${id}`, data, config);
}

// Modifica datos del proveedor
export async function actualizaEvaluacionProveedores(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEvaluacionProveedores + `/${id}`, data, config);
}
