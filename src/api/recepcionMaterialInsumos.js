import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraRecepcion,
    ENDPOINTListarRecepcion,
    ENDPOINTListarRecepcionActiva,
    ENDPOINTObtenerRecepcion,
    ENDPOINTEliminarRecepcion,
    ENDPOINTActualizarRecepcion,
    ENDPOINTListarRecepcionPaginacion,
    ENDPOINTObtenerNoRecepcion,
    ENDPOINTActualizarEstadoRecepcion,
    ENDPOINTObtenerDatosRecepcion,
    ENDPOINTTotalRecepcion
} from "./endpoints";
import axios from 'axios';
import {getTokenApi} from "./auth";

// Registra pedidos de venta
export async function registraRecepcion(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraRecepcion, data, config);
}

export async function totalRecepcion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalRecepcion, config);
}

// Para obtener todos los datos del pedido
export async function obtenerRecepcion(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerRecepcion + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosRecepcion(ordenVenta) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosRecepcion + `/${ordenVenta}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroRecepcion(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoRecepcion, config);
}

// Para listar todos los pedidos
export async function listarRecepcion(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarRecepcion +`/?sucursal=${sucursal}`, config);
}

// Para listar todos los pedidos
export async function listarRecepcionActiva(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarRecepcionActiva +`/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarRecepcionPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarRecepcionPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaRecepcion(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarRecepcion + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoRecepcion(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoRecepcion + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaRecepcion(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarRecepcion + `/${id}`, data, config);
}
