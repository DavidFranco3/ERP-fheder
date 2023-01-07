import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraUM,
    ENDPOINTListarUM,
    ENDPOINTObtenerUM,
    ENDPOINTEliminarUM,
    ENDPOINTActualizarUM,
    ENDPOINTDeshabilitaUM,
    ENDPOINTListarUMPaginacion,
    ENDPOINTTotalUM
} from "./endpoints";
import axios from 'axios';
import {getTokenApi} from "./auth";

// Registra usuarios
export async function registraUM(data) {
    //console.log(data)

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraUM, data, config);
}

// Para obtener todos los datos del usuario
export async function obtenerUM(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerUM + `/${params}`, config);
}

// Obten el total de registros de la colección
export async function totalUM() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalUM, config);
}

// Para listar todos los usuarios
export async function listarUM(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarUM +`/?sucursal=${sucursal}`, config);
}

// Listar los usuarios paginandolos
export async function listarUMPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarUMPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina cliente fisicamente de la bd
export async function eliminaUM(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarUM + `/${id}`, config);
}

// Deshabilita el usuario
export async function deshabilitaUM(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTDeshabilitaUM + `/${id}`, data, config);
}

// Modifica datos del usuario
export async function actualizaUM(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarUM + `/${id}`, data, config);
}
