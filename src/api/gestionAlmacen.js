import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraAlmacen,
    ENDPOINTListarAlmacenes,
    ENDPOINTObtenerAlmacen,
    ENDPOINTEliminarAlmacen,
    ENDPOINTActualizarAlmacen,
    ENDPOINTDeshabilitaAlmacen,
    ENDPOINTListarAlmacenesPaginacion,
    ENDPOINTTotalAlmacenes
} from "./endpoints";
import axios from 'axios';
import {getTokenApi} from "./auth";

// Registra usuarios
export async function registraAlmacenes(data) {
    //console.log(data)

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraAlmacen, data, config);
}

// Para obtener todos los datos del usuario
export async function obtenerAlmacen(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerAlmacen + `/${params}`, config);
}

// Obten el total de registros de la colección
export async function totalAlmacenes() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalAlmacenes, config);
}

// Para listar todos los usuarios
export async function listarAlmacenes(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarAlmacenes +`/?sucursal=${sucursal}`, config);
}

// Listar los usuarios paginandolos
export async function listarAlmacenesPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarAlmacenesPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina cliente fisicamente de la bd
export async function eliminaAlmacen(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarAlmacen + `/${id}`, config);
}

// Deshabilita el usuario
export async function deshabilitaAlmacen(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTDeshabilitaAlmacen + `/${id}`, data, config);
}

// Modifica datos del usuario
export async function actualizaAlmacen(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarAlmacen + `/${id}`, data, config);
}
