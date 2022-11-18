import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraInspeccionPieza,
    ENDPOINTListarInspeccionPieza,
    ENDPOINTObtenerInspeccionPieza,
    ENDPOINTEliminarInspeccionPieza,
    ENDPOINTActualizarInspeccionPieza,
    ENDPOINTListarInspeccionPiezaPaginacion,
    ENDPOINTObtenerNoInspeccionPieza,
    ENDPOINTActualizarEstadoInspeccionPieza,
    ENDPOINTObtenerDatosInspeccionPieza,
    ENDPOINTTotalInspeccionPieza,
} from "./endpoints";
import axios from 'axios';
import {getTokenApi} from "./auth";

// Registra pedidos de venta
export async function registraInspeccionPieza(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraInspeccionPieza, data, config);
}

export async function totalInspeccionPieza() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalInspeccionPieza, config);
}

// Para obtener todos los datos del pedido
export async function obtenerInspeccionPieza(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerInspeccionPieza + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosInspeccionPieza(ordenVenta) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosInspeccionPieza + `/${ordenVenta}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroInspeccionPieza(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoInspeccionPieza, config);
}

// Para listar todos los pedidos
export async function listarInspeccionPieza(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarInspeccionPieza, config);
}

// Listar los pedidos de venta paginandolos
export async function listarPedidosInspeccionPieza(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarInspeccionPiezaPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function ENDPOINTEliminarInspeccionPieza(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarInspeccionPieza + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoInspeccionPieza(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoInspeccionPieza + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaInspeccionPieza(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarInspeccionPieza + `/${id}`, data, config);
}
