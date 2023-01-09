import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraClasificacionMaquinaria,
    ENDPOINTListarClasificacionMaquinaria,
    ENDPOINTObtenerClasificacionMaquinaria,
    ENDPOINTEliminarClasificacionMaquinaria,
    ENDPOINTActualizarClasificacionMaquinaria,
    ENDPOINTDeshabilitaClasificacionMaquinaria,
    ENDPOINTListarClasificacionMaquinariaPaginacion,
    ENDPOINTTotalClasificacionMaquinaria
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra usuarios
export async function registraClasificacionMaquinaria(data) {
    //console.log(data)

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraClasificacionMaquinaria, data, config);
}

// Para obtener todos los datos del usuario
export async function obtenerClasificacionMaquinaria(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerClasificacionMaquinaria + `/${params}`, config);
}

// Obten el total de registros de la colección
export async function totalClasificacionMaquinaria() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalClasificacionMaquinaria, config);
}

// Para listar todos los usuarios
export async function listarClasificacionMaquinaria(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarClasificacionMaquinaria + `/?sucursal=${sucursal}`, config);
}

// Listar los usuarios paginandolos
export async function listarClasificacionMaquinariaPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarClasificacionMaquinariaPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina cliente fisicamente de la bd
export async function eliminaClasificacionMaquinaria(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarClasificacionMaquinaria + `/${id}`, config);
}

// Deshabilita el usuario
export async function deshabilitaClasificacionMaquinaria(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTDeshabilitaClasificacionMaquinaria + `/${id}`, data, config);
}

// Modifica datos del usuario
export async function actualizaClasificacionMaquinaria(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarClasificacionMaquinaria + `/${id}`, data, config);
}
