import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroRemisiones,
    ENDPOINTListarRemisiones,
    ENDPOINTObtenerNoRemisiones,
    ENDPOINTListarPaginandoRemisiones,
    ENDPOINTObtenerRemisiones,
    ENDPOINTEliminarRemisiones,
    ENDPOINTActualizarRemisiones,
    ENDPOINTTotalRemisiones
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra remisiones
export async function registraRemision(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroRemisiones, data, config);
}

// Obten el total de registros de la colección
export async function totalRemisiones() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalRemisiones, config);
}

// Para obtener todos los datos de la remisión
export async function obtenerRemision(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerRemisiones + `/${id}`, config);
}

// Para obtener el número de remisión actual
export async function obtenerNumeroRemision() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoRemisiones, config);
}

// Para listar todas las remisiones
export async function listarRemisiones(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarRemisiones +`/?sucursal=${sucursal}`, config);
}

// Lista las remisiones paginandolos
export async function listarRemisionesPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoRemisiones + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina remisiones
export async function eliminaRemisiones(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarRemisiones + `/${id}`, config);
}

// Modifica datos de una remisión
export async function actualizaRemisiones(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarRemisiones + `/${id}`, data, config);
}

