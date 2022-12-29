import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraEmpaque,
    ENDPOINTListarEmpaque,
    ENDPOINTListarPaginandoEmpaque,
    ENDPOINTObtenerEmpaque,
    ENDPOINTObtenerPorFolioEmpaque,
    ENDPOINTObtenerFolioActualEmpaque,
    ENDPOINTEliminarEmpaque,
    ENDPOINTActualizarEmpaque,
    ENDPOINTTotalEmpaque
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra materia prima
export async function registraEmpaque(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraEmpaque, data, config);
}

// Obten el total de registros de la colección
export async function totalEmpaque() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalEmpaque, config);
}

// Para obtener todos los datos de la materia prima
export async function obtenerEmpaque(params) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerEmpaque + `/${params}`, config);
}

// Obtener los datos de la materia prima segun el folio -- ENDPOINTObtenerPorFolioMateriaPrima
export async function obtenerEmpaquePorFolio(folio) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerPorFolioEmpaque + `/${folio}`, config);
}

// Para obtener el folio actual de la materia prima
export async function obtenerFolioActualEmpaque() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioActualEmpaque, config);
}

// Para listar todos los productos
export async function listarEmpaque(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarEmpaque +`/?sucursal=${sucursal}`, config);
}

// Lista la materia prima paginando
export async function listarEmpaquePaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoEmpaque + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina materia prima
export async function eliminaEmpaque(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarEmpaque + `/${id}`, config);
}

// Modifica datos de la materia prima
export async function actualizaEmpaque(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEmpaque + `/${id}`, data, config);
}
