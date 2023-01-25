import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraRazonSocial,
    ENDPOINTListarRazonSocial,
    ENDPOINTListarRazonSocialActiva,
    ENDPOINTObtenerRazonSocial,
    ENDPOINTEliminarRazonSocial,
    ENDPOINTActualizarRazonSocial,
    ENDPOINTDeshabilitarRazonSocial,
    ENDPOINTListarRazonSocialPaginacion,
    ENDPOINTTotalRazonSocial
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";
export let nombreUsuario = "";
export let apellidosUsuario = "";

// Registra clientes
export async function registraRazonSocial(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraRazonSocial, data, config);
}

// Obten el total de registros de la colección
export async function totalRazonSocial() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalRazonSocial, config);
}

// Para obtener todos los datos del cliente
export async function obtenerRazonSocial(params) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerRazonSocial + `/${params}`, config);
}

// Para listar todos los clientes
export async function listarRazonSocial() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarRazonSocial, config);
}

// Para listar todos los clientes
export async function listarRazonSocialActiva() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarRazonSocialActiva, config);
}

// Lista los clientes paginandolos
export async function listarRazonSocialPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarRazonSocialPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina cliente fisicamente de la bd
export async function eliminaRazonSocial(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarRazonSocial + `/${id}`, config);
}

// Deshabilita el usuario
export async function deshabilitaRazonSocial(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTDeshabilitarRazonSocial + `/${id}`, data, config);
}

// Modifica datos del cliente
export async function actualizaRazonSocial(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarRazonSocial + `/${id}`, data, config);
}
