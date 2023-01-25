import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraClientes,
    ENDPOINTListarClientes,
    ENDPOINTListarClientesActivos,
    ENDPOINTObtenerClientes,
    ENDPOINTEliminarClientes,
    ENDPOINTActualizarClientes,
    ENDPOINTDeshabilitaCliente,
    ENDPOINTListarClientesPaginacion,
    ENDPOINTTotalClientes
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";
export let nombreUsuario = "";
export let apellidosUsuario = "";

// Registra clientes
export async function registraClientes(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraClientes, data, config);
}

// Obten el total de registros de la colección
export async function totalClientes() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalClientes, config);
}

// Para obtener todos los datos del cliente
export async function obtenerCliente(params) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerClientes + `/${params}`, config);
}

// Para listar todos los clientes
export async function listarClientes(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarClientes +`/?sucursal=${sucursal}`, config);
}

// Para listar todos los clientes
export async function listarClientesActivos(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarClientesActivos +`/?sucursal=${sucursal}`, config);
}

// Lista los clientes paginandolos
export async function listarClientesPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarClientesPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina cliente fisicamente de la bd
export async function eliminaCliente(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarClientes + `/${id}`, config);
}

// Deshabilita el usuario
export async function deshabilitaCliente(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTDeshabilitaCliente + `/${id}`, data, config);
}

// Modifica datos del cliente
export async function actualizaCliente(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarClientes + `/${id}`, data, config);
}
