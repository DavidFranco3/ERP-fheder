import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroAcusesRecibos,
    ENDPOINTListarAcusesRecibos,
    ENDPOINTObtenerNoAcusesRecibos,
    ENDPOINTListarPaginandoAcusesRecibos,
    ENDPOINTObtenerAcusesRecibos,
    ENDPOINTEliminarAcusesRecibos,
    ENDPOINTActualizarAcusesRecibos,
    ENDPOINTTotalAcusesRecibos
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra acuses de recibo
export async function registraAcuseRecibo(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroAcusesRecibos, data, config);
}

// Obten el total de registros de la colección
export async function totalAcusesRecibo() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalAcusesRecibos, config);
}

// Para obtener todos los datos de un acuses de recibo
export async function obtenerAcuseRecibo(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerAcusesRecibos + `/${id}`, config);
}

// Para obtener el número de acuses de recibo actual
export async function obtenerNumeroAcuseRecibo() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoAcusesRecibos, config);
}

// Para listar todos los acuses de recibo
export async function listarAcuseRecibo(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarAcusesRecibos, config);
}

// Lista los acuses de recibo paginandolos
export async function listarAcuseReciboPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoAcusesRecibos + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina acuse de recibo
export async function eliminaAcuseRecibo(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarAcusesRecibos + `/${id}`, config);
}

// Modifica datos de un acuse de recibo
export async function actualizaAcuseRecibo(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarAcusesRecibos + `/${id}`, data, config);
}
