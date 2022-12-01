import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroRequisicion,
    ENDPOINTListarRequisicion,
    ENDPOINTListarPaginandoRequisicion,
    ENDPOINTListarPorDepartamento,
    ENDPOINTObtenerRequisicion,
    ENDPOINTObtenerNoRequisicion,
    ENDPOINTEliminarRequisicion,
    ENDPOINTObtenerItemRequisicion,
    ENDPOINTCambiarStatusRequisicion,
    ENDPOINTActualizarRequisicion,
    ENDPOINTTotalRequisicion
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra requisición
export async function registraRequisicion(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroRequisicion, data, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerItem() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemRequisicion, config);
}

// Obten el total de registros de la colección
export async function totalRequision() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalRequisicion, config);
}


// Para obtener todos los datos de la requisición
export async function obtenerRequisiciones(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerRequisicion + `/${id}`, config);
}

// Para obtener el numero de requisicion actual
export async function obtenerNumeroRequisicion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoRequisicion, config);
}

// Para listar todas las requisiciones
export async function listarRequisiciones(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarRequisicion, config);
}

// Para listar las requisiciones por departamentos
export async function listarRequisicionesPorDepartamentos(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPorDepartamento, config);
}

// Lista las requisiciones paginandolas
export async function listarRequisicionesPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoRequisicion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina requisiciones
export async function eliminaRequisiciones(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarRequisicion + `/${id}`, config);
}

// Cambia el status de una requisición
export async function cambiaStatusRequisicion(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTCambiarStatusRequisicion + `/${id}`, data, config);
}

// Modifica datos de la requisición
export async function actualizaRequisiciones(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarRequisicion + `/${id}`, data, config);
}
