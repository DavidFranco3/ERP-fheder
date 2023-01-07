import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraClasificacionMaterial,
    ENDPOINTListarClasificacionMaterial,
    ENDPOINTObtenerClasificacionMaterial,
    ENDPOINTEliminarClasificacionMaterial,
    ENDPOINTActualizarClasificacionMaterial,
    ENDPOINTDeshabilitaClasificacionMaterial,
    ENDPOINTListarClasificacionMaterialPaginacion,
    ENDPOINTTotalClasificacionMaterial
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra usuarios
export async function registraClasificacionMaterial(data) {
    //console.log(data)

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraClasificacionMaterial, data, config);
}

// Para obtener todos los datos del usuario
export async function obtenerClasificacionMaterial(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerClasificacionMaterial + `/${params}`, config);
}

// Obten el total de registros de la colección
export async function totalClasificacionMaterial() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalClasificacionMaterial, config);
}

// Para listar todos los usuarios
export async function listarClasificacionMaterial(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarClasificacionMaterial+ `/?sucursal=${sucursal}`, config);
}

// Listar los usuarios paginandolos
export async function listarClasificacionMaterialPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarClasificacionMaterialPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina cliente fisicamente de la bd
export async function eliminaClasificacionMaterial(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarClasificacionMaterial + `/${id}`, config);
}

// Deshabilita el usuario
export async function deshabilitaClasificacionMaterial(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTDeshabilitaClasificacionMaterial + `/${id}`, data, config);
}

// Modifica datos del usuario
export async function actualizaClasificacionMaterial(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarClasificacionMaterial + `/${id}`, data, config);
}
