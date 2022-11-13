import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroSalidaPlanta,
    ENDPOINTListarSalidaPlanta,
    ENDPOINTObtenerFolioActualSalidaPlanta,
    ENDPOINTListarPaginandoSalidaPlanta,
    ENDPOINTObtenerSalidaPlanta,
    ENDPOINTObtenerDatosSalidaPlanta,
    ENDPOINTEliminarSalidaPlanta,
    ENDPOINTActualizarSalidaPlanta,
    ENDPOINTTotalSalidaPlanta
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra salidas de la planta
export async function registraSalidaPlanta(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroSalidaPlanta, data, config);
}

// Obten el total de registros de la colección
export async function totalSalidaPlanta() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalSalidaPlanta, config);
}


// Listar los registros de salidas de la planta
export async function listarSalidaPlanta() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarSalidaPlanta, config);
}

// Obtener el folio actual de salidas de la planta
export async function obtenerFolioActualSalidasPlanta() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioActualSalidaPlanta, config);
}

// Listar paginando las salidas de la planta
export async function listarPaginacionSalidaPlanta(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoSalidaPlanta + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Obtener los datos de una salida de la planta segun id
export async function obtenerSalidaPlanta(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerSalidaPlanta + `/${id}`, config);
}

// Obtener los datos de una salida de la planta segun el folio
export async function obtenerDatosSalidaPlanta(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosSalidaPlanta + `/${folio}`, config);
}

// Eliminar una salida de planta
export async function eliminaSalidaPlanta(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarSalidaPlanta + `/${id}`, config);
}

// Actualizar los datos de una salida de planta
export async function actualizaSalidaPlanta(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarSalidaPlanta + `/${id}`, data, config);
}


