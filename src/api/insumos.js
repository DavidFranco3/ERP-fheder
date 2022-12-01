import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraInsumo,
    ENDPOINTListarInsumo,
    ENDPOINTListarPaginandoInsumo,
    ENDPOINTObtenerInsumo,
    ENDPOINTObtenerPorFolioInsumo,
    ENDPOINTObtenerFolioActualInsumo,
    ENDPOINTEliminarInsumo,
    ENDPOINTActualizarInsumo,
    ENDPOINTTotalInsumo
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra materia prima
export async function registraInsumo(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraInsumo, data, config);
}

// Obten el total de registros de la colección
export async function totalInsumo() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalInsumo, config);
}

// Para obtener todos los datos de la materia prima
export async function obtenerInsumo(params) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerInsumo + `/${params}`, config);
}

// Obtener los datos de la materia prima segun el folio -- ENDPOINTObtenerPorFolioMateriaPrima
export async function obtenerInsumoPrimaPorFolio(folio) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerPorFolioInsumo + `/${folio}`, config);
}

// Para obtener el folio actual de la materia prima
export async function obtenerFolioActualInsumo() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioActualInsumo, config);
}

// Para listar todos los productos
export async function listarInsumo(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarInsumo, config);
}

// Lista la materia prima paginando
export async function listarInsumoPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoInsumo + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina materia prima
export async function eliminaInsumo(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarInsumo + `/${id}`, config);
}

// Modifica datos de la materia prima
export async function actualizaInsumo(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarInsumo + `/${id}`, data, config);
}
