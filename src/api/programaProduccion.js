import { API_HOST } from "../utils/constants";
import {
ENDPOINTRegistroPrograma,
ENDPOINTListarPrograma,
ENDPOINTListarPaginandoPrograma,
ENDPOINTObtenerPrograma,
ENDPOINTObtenerNoPrograma,
ENDPOINTObtenerItemPrograma,
ENDPOINTEliminarPrograma,
ENDPOINTActualizarEstadoPrograma,
ENDPOINTActualizarPrograma,
ENDPOINTObtenerDatosPrograma,
ENDPOINTTotalPrograma,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra orden de compra
export async function registrPrograma(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroPrograma, data, config);
}

// Obten el total de registros de la colección
export async function totalPrograma() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalPrograma, config);
}

// Para obtener todos los datos de una orden de compra
export async function obtenerPrograma(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerPrograma + `/${id}`, config);
}

// Para obtener los datos de una compra segun el folio
export async function obtenerDatosPrograma(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosPrograma + `/${folio}`, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerNumeroPrograma() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoPrograma, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerItemPrograma() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemPrograma, config);
}

// Para listar todas las órdenes de compra
export async function listarPrograma(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPrograma +`/?sucursal=${sucursal}`, config);
}

// Lista las ordenes de compra paginándolas
export async function listarProgramaPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoPrograma + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina órdenes de compra
export async function eliminaPrograma(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarPrograma + `/${id}`, config);
}

// Actualiza estado de una orden de compra
export async function cambiaStatusPrograma(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoPrograma + `/${id}`, data, config);
}

// Modifica datos de una orden de compra
export async function actualizaPrograma(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarPrograma + `/${id}`, data, config);
}