import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroRechazos,
    ENDPOINTListarRechazos,
    ENDPOINTObtenerNoRechazos,
    ENDPOINTListarPaginandoRechazos,
    ENDPOINTObtenerRechazos,
    ENDPOINTEliminarRechazos,
    ENDPOINTActualizarRechazos,
    ENDPOINTTotalRechazos
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra rechazos
export async function registraRechazos(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroRechazos, data, config);
}

// Obten el total de registros de la colección
export async function totalRechazos() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalRechazos, config);
}

// Para obtener todos los datos de un rechazo
export async function obtenerRechazo(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerRechazos + `/${id}`, config);
}

// Para obtener el número de rechazo actual
export async function obtenerNumeroRechazo() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoRechazos, config);
}

// Para listar todos los rechazos
export async function listarRechazos(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarRechazos +`/?sucursal=${sucursal}`, config);
}

// Lista los rechazos paginandolos
export async function listarRechazosPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoRechazos + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina rechazos
export async function eliminaRechazos(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarRechazos + `/${id}`, config);
}

// Modifica datos de un rechazo
export async function actualizaRechazos(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarRechazos + `/${id}`, data, config);
}
