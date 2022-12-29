import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraMateriaPrima,
    ENDPOINTListarMateriaPrima,
    ENDPOINTListarPaginandoMateriaPrima,
    ENDPOINTObtenerMateriaPrima,
    ENDPOINTObtenerPorFolioMateriaPrima,
    ENDPOINTObtenerFolioActualMateriaPrima,
    ENDPOINTEliminarMateriaPrima,
    ENDPOINTActualizarMateriaPrima,
    ENDPOINTTotalMateriaPrima
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra materia prima
export async function registraMateriaPrima(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraMateriaPrima, data, config);
}

// Obten el total de registros de la colección
export async function totalMateriaPrima() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalMateriaPrima, config);
}

// Para obtener todos los datos de la materia prima
export async function obtenerMateriaPrima(params) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerMateriaPrima + `/${params}`, config);
}

// Obtener los datos de la materia prima segun el folio -- ENDPOINTObtenerPorFolioMateriaPrima
export async function obtenerMateriaPrimaPorFolio(folio) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerPorFolioMateriaPrima + `/${folio}`, config);
}

// Para obtener el folio actual de la materia prima
export async function obtenerFolioActualMP() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioActualMateriaPrima, config);
}

// Para listar todos los productos
export async function listarMateriaPrima(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarMateriaPrima +`/?sucursal=${sucursal}`, config);
}

// Lista la materia prima paginando
export async function listarMateriaPrimaPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoMateriaPrima + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina materia prima
export async function eliminaMateriaPrima(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarMateriaPrima + `/${id}`, config);
}

// Modifica datos de la materia prima
export async function actualizaMateriaPrima(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarMateriaPrima + `/${id}`, data, config);
}
