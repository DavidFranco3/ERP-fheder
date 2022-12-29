import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroDevoluciones,
    ENDPOINTListarDevoluciones,
    ENDPOINTObtenerNoDevoluciones,
    ENDPOINTListarPaginandoDevoluciones,
    ENDPOINTObtenerDevoluciones,
    ENDPOINTEliminarDevoluciones,
    ENDPOINTActualizarDevoluciones,
    ENDPOINTTotalDevoluciones
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra devoluciones
export async function registraDevoluciones(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroDevoluciones, data, config);
}

// Obten el total de registros de la colección
export async function totalDevoluciones() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalDevoluciones, config);
}

// Para obtener todos los datos de una devolución
export async function obtenerDevolucion(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDevoluciones + `/${id}`, config);
}

// Para obtener el número de devolución actual
export async function obtenerNumeroDevolucion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoDevoluciones, config);
}

// Para listar todas las devoluciones
export async function listarDevoluciones(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarDevoluciones +`/?sucursal=${sucursal}`, config);
}

// Lista las devoluciones paginandolos
export async function listarDevolucionesPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoDevoluciones + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina devoluciones
export async function eliminaDevoluciones(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarDevoluciones + `/${id}`, config);
}

// Modifica datos de una devolución
export async function actualizaDevoluciones(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarDevoluciones + `/${id}`, data, config);
}
