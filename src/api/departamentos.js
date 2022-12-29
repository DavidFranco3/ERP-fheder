import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraDepartamentos,
    ENDPOINTListarDepartamentos,
    ENDPOINTObtenerDepartamentos,
    ENDPOINTEliminarDepartamentos,
    ENDPOINTActualizarDepartamentos,
    ENDPOINTListarDepartamentosPaginacion,
    ENDPOINTTotalDepartamentos
} from "./endpoints";
import axios from 'axios';
import {getTokenApi} from "./auth";

// Registra departamentos
export async function registraDepartamento(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraDepartamentos, data, config);
}

// Obten el total de registros de la colección
export async function totalDepartamentos() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalDepartamentos, config);
}

// Para obtener todos los datos del departamento
export async function obtenerDepartamento(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDepartamentos + `/${params}`, config);
}

// Para listar todos los departamentos
export async function listarDepartamento(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarDepartamentos +`/?sucursal=${sucursal}`, config);
}

// Listar los departamentos paginandolos
export async function listarDepartamentosPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarDepartamentosPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina departamento fisicamente de la bd
export async function eliminaDepartamento(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarDepartamentos + `/${id}`, config);
}

// Modifica datos del departamentos
export async function actualizaDepartamento(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarDepartamentos + `/${id}`, data, config);
}
