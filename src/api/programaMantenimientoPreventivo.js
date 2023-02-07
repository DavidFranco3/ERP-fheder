import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraMantenimientoPreventivo,
    ENDPOINTObtenerItemMantenimientoPreventivo,
    ENDPOINTListarMantenimientoPreventivo,
    ENDPOINTObtenerMantenimientoPreventivo,
    ENDPOINTEliminarMantenimientoPreventivo,
    ENDPOINTActualizarMantenimientoPreventivo,
    ENDPOINTActualizarEstadoMantenimientoPreventivo,
    ENDPOINTListarMantenimientoPreventivoPaginacion,
    ENDPOINTTotalMantenimientoPreventivo,
} from "./endpoints";
import axios from 'axios';
import {getTokenApi} from "./auth";

// Registra pedidos de venta
export async function registraMantenimientoPreventivo(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraMantenimientoPreventivo, data, config);
}

export async function totalMantenimientoPreventivo() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalMantenimientoPreventivo, config);
}

export async function obtenerItemMantenimientoPreventivo() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemMantenimientoPreventivo, config);
}

// Para obtener todos los datos del pedido
export async function obtenerMantenimientoPreventivo(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerMantenimientoPreventivo + `/${params}`, config);
}

// Para listar todos los pedidos
export async function listarMantenimientoPreventivo(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarMantenimientoPreventivo +`/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarMantenimientoPreventivoPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarMantenimientoPreventivoPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaMantenimientoPreventivo(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarMantenimientoPreventivo + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoMantenimientoPreventivo(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoMantenimientoPreventivo + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaMantenimientoPreventivo(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarMantenimientoPreventivo + `/${id}`, data, config);
}
