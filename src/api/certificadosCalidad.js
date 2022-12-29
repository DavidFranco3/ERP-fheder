import { API_HOST } from "../utils/constants";
import {
ENDPOINTRegistroCertificado,
ENDPOINTListarCertificado,
ENDPOINTListarPaginandoCertificado,
ENDPOINTObtenerCertificado,
ENDPOINTObtenerNoCertificado,
ENDPOINTObtenerItemCertificado,
ENDPOINTEliminarCertificado,
ENDPOINTActualizarEstadoCertificado,
ENDPOINTActualizarCertificado,
ENDPOINTObtenerDatosCertificado,
ENDPOINTTotalCertificado,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra orden de compra
export async function registraCertificado(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroCertificado, data, config);
}

// Obten el total de registros de la colección
export async function totalCertificado() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalCertificado, config);
}

// Para obtener todos los datos de una orden de compra
export async function obtenerCertificado(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerCertificado + `/${id}`, config);
}

// Para obtener los datos de una compra segun el folio
export async function obtenerDatosCertificado(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosCertificado + `/${folio}`, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerNumeroCertificado() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoCertificado, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerItemCertificado() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemCertificado, config);
}

// Para listar todas las órdenes de compra
export async function listarCertificado(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCertificado +`/?sucursal=${sucursal}`, config);
}

// Lista las ordenes de compra paginándolas
export async function listarCertificadoPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoCertificado + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina órdenes de compra
export async function eliminaCertificado(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarCertificado + `/${id}`, config);
}

// Actualiza estado de una orden de compra
export async function cambiaStatusCertificado(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoCertificado + `/${id}`, data, config);
}

// Modifica datos de una orden de compra
export async function actualizaCertificado(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarCertificado + `/${id}`, data, config);
}