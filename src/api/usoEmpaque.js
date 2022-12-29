import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroUsoEmpaque,
    ENDPOINTListarUsoEmpaque,
    ENDPOINTListarPaginandoUsoEmpaque,
    ENDPOINTObtenerUsoEmpaque,
    ENDPOINTObtenerDatosUsoEmpaque,
    ENDPOINTEliminarUsoEmpaque,
    ENDPOINTActualizarUsoEmpaque,
    ENDPOINTTotalUsoEmpaque
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra uso de empaque
export async function registraUsoEmpaque(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroUsoEmpaque, data, config);
}

// Obten el total de registros de la colección
export async function totalUsoEmpaque() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalUsoEmpaque, config);
}


// Para obtener todos los datos de un uso de empaque en especifico
export async function obtenerUsoEmpaque(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerUsoEmpaque + `/${id}`, config);
}

// Para obtener los datos de usos de empaque segun la clave
export async function obtenerDatosUsoEmpaque(clave) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosUsoEmpaque + `/${clave}`, config);
}

// Para listar todos los usos de empaque
export async function listarUsosEmpaque(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarUsoEmpaque +`/?sucursal=${sucursal}`, config);
}

// Listar los usos de empaque paginandolos
export async function listarUsosEmpaquePaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoUsoEmpaque + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina usos del empaque
export async function eliminaUsosEmpaque(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarUsoEmpaque + `/${id}`, config);
}

// Modifica datos de usos del empaque
export async function actualizaUsosEmpaque(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarUsoEmpaque + `/${id}`, data, config);
}
