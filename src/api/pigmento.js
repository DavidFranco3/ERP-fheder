import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraPigmento,
    ENDPOINTListarPigmento,
    ENDPOINTListarPaginandoPigmento,
    ENDPOINTObtenerPigmento,
    ENDPOINTObtenerPorFolioPigmento,
    ENDPOINTObtenerFolioActualPigmento,
    ENDPOINTEliminarPigmento,
    ENDPOINTActualizarPigmento,
    ENDPOINTTotalPigmento
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra materia prima
export async function registraPigmento(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraPigmento, data, config);
}

// Obten el total de registros de la colección
export async function totalPigmento() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalPigmento, config);
}

// Para obtener todos los datos de la materia prima
export async function obtenerPigmento(params) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerPigmento + `/${params}`, config);
}

// Obtener los datos de la materia prima segun el folio -- ENDPOINTObtenerPorFolioMateriaPrima
export async function obtenerPigmentoPorFolio(folio) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerPorFolioPigmento + `/${folio}`, config);
}

// Para obtener el folio actual de la materia prima
export async function obtenerFolioActualPigmento() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioActualPigmento, config);
}

// Para listar todos los productos
export async function listarPigmento(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPigmento, config);
}

// Lista la materia prima paginando
export async function listarPigmentoPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoPigmento + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina materia prima
export async function eliminaPigmento(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarPigmento + `/${id}`, config);
}

// Modifica datos de la materia prima
export async function actualizaPigmento(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarPigmento + `/${id}`, data, config);
}
