import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraMaquina,
    ENDPOINTListarMaquina,
    ENDPOINTListarPaginandoMaquina,
    ENDPOINTObtenerMaquina,
    ENDPOINTObtenerDatosMaquina,
    ENDPOINTEliminarMaquina,
    ENDPOINTActualizarMaquina,
    ENDPOINTTotalMaquina,
    ENDPOINTActualizarEstadoMaquina
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra materia prima
export async function registraMaquina(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraMaquina, data, config);
}

// Obten el total de registros de la colección
export async function totalMaquina() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalMaquina, config);
}

// Para obtener todos los datos de la materia prima
export async function obtenerMaquina(params) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerMaquina + `/${params}`, config);
}

// Obtener los datos de la materia prima segun el folio -- ENDPOINTObtenerPorFolioMateriaPrima
export async function obtenerMaquinaNumero(folio) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosMaquina, + `/${folio}`, config);
}

// Para listar todos los productos
export async function listarMaquina(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarMaquina +`/?sucursal=${sucursal}`, config);
}

// Lista la materia prima paginando
export async function listarMaquinaPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoMaquina + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina materia prima
export async function eliminaMaquina(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarMaquina + `/${id}`, config);
}

// Actualiza estado de una orden de compra
export async function actualizaEstadoMaquina(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoMaquina + `/${id}`, data, config);
}

// Modifica datos de la materia prima
export async function actualizaMaquina(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarMaquina + `/${id}`, data, config);
}
