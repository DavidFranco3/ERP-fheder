import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroRequerimientosEspecificos,
    ENDPOINTListarRequerimientosEspecificos,
    ENDPOINTObtenerFolioActualRequerimientosEspecificos,
    ENDPOINTListarPaginandoRequerimientosEspecificos,
    ENDPOINTObtenerRequerimientosEspecificos,
    ENDPOINTObtenerDatosRequerimientosEspecificos,
    ENDPOINTEliminarRequerimientosEspecificos,
    ENDPOINTActualizarRequerimientosEspecificos,
    ENDPOINTTotalRequerimientosEspecificos
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";


// Registro de requerimientos especificos
export async function registraRequerimientoEspecifico(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroRequerimientosEspecificos, data, config);
}

// Obten el total de registros de la colección
export async function totalRequerimientosEspecificos() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalRequerimientosEspecificos, config);
}

// Listar todos los requerimientos especificos
export async function listarRequerimientosEspecificos(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarRequerimientosEspecificos +`/?sucursal=${sucursal}`, config);
}

// Obtener el folio actual del requerimiento especifico
export async function obtenerFolioActualRequerimientosEspecificos() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioActualRequerimientosEspecificos, config);
}

// Listar paginando los requerimientos especificos
export async function listarPaginacionRequerimientosEspecificos(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoRequerimientosEspecificos + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Obtener la informacion de los requerimientos especificos segun el id
export async function obtenerRequerimientosEspecificos(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerRequerimientosEspecificos + `/${id}`, config);
}

// Obtener la informacion de los requerimientos especificos segun el folio
export async function obtenerDatosRequerimientosEspecificos(ordenVenta) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosRequerimientosEspecificos + `/${ordenVenta}`, config);
}

// Eliminar los requerimientos especificos
export async function eliminaRequerimientoEspecifico(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarRequerimientosEspecificos + `/${id}`, config);
}

// Actualiza la información de los requerimientos especificos
export async function actualizaRequerimientosEspecificos(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarRequerimientosEspecificos + `/${id}`, data, config);
}

