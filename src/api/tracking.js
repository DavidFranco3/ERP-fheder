import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroTracking,
    ENDPOINTListarTracking,
    ENDPOINTObtenerNoTracking,
    ENDPOINTListarPaginandoTracking,
    ENDPOINTObtenerTracking,
    ENDPOINTEliminarTracking,
    ENDPOINTActualizarEstadoTracking,
    ENDPOINTActualizarTracking,
    ENDPOINTObtenerDatosTracking,
    ENDPOINTTotalTracking
} from "./endpoints";
import axios from 'axios';
import {getTokenApi} from "./auth";

// Registra tracking
export async function registraTracking(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroTracking, data, config);
}

// Obten el total de registros de la colección
export async function totalTracking() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalTracking, config);
}

// Para obtener todos los datos de un tracking
export async function obtenerTracking(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerTracking + `/${params}`, config);
}

// Para obtener los datos del tracking segun el numero de venta proporcionado -- ENDPOINTObtenerDatosTracking
export async function obtenerDatosTracking(ordenVenta) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosTracking + `/${ordenVenta}`, config);
}

// Para obtener el numero de tracking actual
export async function obtenerNumeroTracking(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoTracking, config);
}

// Para listar todos los tracking registrados
export async function listarTracking(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarTracking, config);
}

// Listar los tracking paginandolos
export async function listarTrackingPaginado(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoTracking + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina tracking
export async function eliminaPedidoVenta(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarTracking + `/${id}`, config);
}

// Para actualizar el estado del tracking
export async function actualizaEstadoTracking(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoTracking + `/${id}`, data, config);
}

// Modifica datos del tracking
export async function actualizaTracking(ordenVenta, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarTracking + `/${ordenVenta}`, data, config);
}
