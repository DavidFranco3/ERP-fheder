import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraAsignacionPedido,
    ENDPOINTListarAsignacionPedido,
    ENDPOINTObtenerAsignacionPedido,
    ENDPOINTEliminarAsignacionPedido,
    ENDPOINTActualizarAsignacionPedido,
    ENDPOINTListarAsignacionPedidoPaginacion,
    ENDPOINTObtenerNoAsignacionPedido,
    ENDPOINTActualizarEstadoAsignacionPedido,
    ENDPOINTObtenerDatosAsignacionPedido,
    ENDPOINTTotalAsignacionPedido,
    ENDPOINTObtenerItemAsignacion,
} from "./endpoints";
import axios from 'axios';
import {getTokenApi} from "./auth";

// Registra pedidos de venta
export async function registraAsignacionPedido(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraAsignacionPedido, data, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerItem() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemAsignacion, config);
}

export async function totalAsignacionPedido() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalAsignacionPedido, config);
}

// Para obtener todos los datos del pedido
export async function obtenerAsignacionPedido(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerAsignacionPedido + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosAsignacionPedido(ordenVenta) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosAsignacionPedido + `/${ordenVenta}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroAsignacionPedido(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoAsignacionPedido, config);
}

// Para listar todos los pedidos
export async function listarAsignacionPedidos(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarAsignacionPedido, config);
}

// Listar los pedidos de venta paginandolos
export async function listarAsignacionPedidosPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarAsignacionPedidoPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaAsignacionPedido(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarAsignacionPedido + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoAsignacionPedido(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoAsignacionPedido + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaPedidoVenta(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarAsignacionPedido + `/${id}`, data, config);
}
