import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraSucursal,
    ENDPOINTListarSucursales,
    ENDPOINTObtenerSucursal,
    ENDPOINTEliminarSucursal,
    ENDPOINTActualizarSucursal,
    ENDPOINTDeshabilitaSucursal,
    ENDPOINTListarSucursalesPaginacion,
    ENDPOINTTotalSucursales
} from "./endpoints";
import axios from 'axios';
import {getTokenApi} from "./auth";

// Registra usuarios
export async function registraSucursales(data) {
    //console.log(data)

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraSucursal, data, config);
}

// Para obtener todos los datos del usuario
export async function obtenerSucursal(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerSucursal + `/${params}`, config);
}

// Obten el total de registros de la colección
export async function totalSucursales() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalSucursales, config);
}

// Para listar todos los usuarios
export async function listarSucursales(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarSucursales, config);
}

// Listar los usuarios paginandolos
export async function listarSucursalesPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarSucursalesPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina cliente fisicamente de la bd
export async function eliminaSucursal(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarSucursal + `/${id}`, config);
}

// Deshabilita el usuario
export async function deshabilitaSucursal(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTDeshabilitaSucursal + `/${id}`, data, config);
}

// Modifica datos del usuario
export async function actualizaSucursal(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarSucursal + `/${id}`, data, config);
}
