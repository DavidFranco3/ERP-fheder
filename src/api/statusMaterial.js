import { API_HOST } from "../utils/constants";
import {
ENDPOINTRegistroStatusMaterial,
ENDPOINTListarStatusMaterial,
ENDPOINTListarPaginandoStatusMaterial,
ENDPOINTObtenerStatusMaterial,
ENDPOINTObtenerNoStatusMaterial,
ENDPOINTObtenerItemStatusMaterial,
ENDPOINTEliminarStatusMaterial,
ENDPOINTActualizarEstadoStatusMaterial,
ENDPOINTActualizarStatusMaterial,
ENDPOINTObtenerDatosStatusMaterial,
ENDPOINTTotalStatusMaterial,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra orden de compra
export async function registraStatusMaterial(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroStatusMaterial, data, config);
}

// Obten el total de registros de la colección
export async function totalStatusMaterial() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalStatusMaterial, config);
}

// Para obtener todos los datos de una orden de compra
export async function obtenerStatusMaterial(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerStatusMaterial + `/${id}`, config);
}

// Para obtener los datos de una compra segun el folio
export async function obtenerDatosStatusMaterial(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosStatusMaterial + `/${folio}`, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerNumeroStatusMaterial() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoStatusMaterial, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerItemStatusMaterial() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemStatusMaterial, config);
}

// Para listar todas las órdenes de compra
export async function listarStatusMaterial(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarStatusMaterial +`/?sucursal=${sucursal}`, config);
}

// Lista las ordenes de compra paginándolas
export async function listarStatusMaterialPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoStatusMaterial + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina órdenes de compra
export async function eliminaStatusMaterial(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarStatusMaterial + `/${id}`, config);
}

// Actualiza estado de una orden de compra
export async function cambiaStatusMaterial(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoStatusMaterial + `/${id}`, data, config);
}

// Modifica datos de una orden de compra
export async function actualizaStatusMaterial(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarStatusMaterial + `/${id}`, data, config);
}