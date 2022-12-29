import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroVerificacionEmbarques,
    ENDPOINTListarVerificacionEmbarques,
    ENDPOINTObtenerFolioActualVerificacionEmbarques,
    ENDPOINTListarPaginandoVerificacionEmbarques,
    ENDPOINTObtenerVerificacionEmbarques,
    ENDPOINTObtenerDatosVerificacionEmbarques,
    ENDPOINTEliminarVerificacionEmbarques,
    ENDPOINTActualizarVerificacionEmbarques,
    ENDPOINTTotalVerificacionEmbarques
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registro de una verificación de embarques
export async function registraVerificacionEmbarque(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroVerificacionEmbarques, data, config);
}

// Obten el total de registros de la colección
export async function totalVerificacionEmbarques() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalVerificacionEmbarques, config);
}

// Listar todas las verificaciones de embarques registradas
export async function listarVerificacionEmbarque(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarVerificacionEmbarques +`/?sucursal=${sucursal}`, config);
}

// Obtener el folio actual de la verificación de embarque
export async function obtenerFolioActualVerificacionEmbarque() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioActualVerificacionEmbarques, config);
}

// Listar paginando las verificaciones de embarque
export async function listarPaginacionVerificacionEmbarque(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoVerificacionEmbarques + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Obtener todos los datos de una verificación de embarque segun el id
export async function obtenerVerificacionEmbarque(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerVerificacionEmbarques + `/${id}`, config);
}

// Obtener todos los datos de una verificación de embarque segun el folio
export async function obtenerDatosVerificacionEmbarque(ordenVenta) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosVerificacionEmbarques + `/${ordenVenta}`, config);
}

// Eliminar una verificación de embarque

export async function eliminaVerificacionEmbarque(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarVerificacionEmbarques + `/${id}`, config);
}

// Actualizar la información de una verificación de embarque
export async function actualizaVerificacionEmbarque(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarVerificacionEmbarques + `/${id}`, data, config);
}

