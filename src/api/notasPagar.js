import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraNotaPagar,
    ENDPOINTListarNotasPagar,
    ENDPOINTListarNotasPagarPorTipo,
    ENDPOINTListarNotasPagarActivas,
    ENDPOINTObtenerNotasPagar,
    ENDPOINTObtenerDatosNotasPagar,
    ENDPOINTEliminarNotasPagar,
    ENDPOINTActualizarNotasPagar,
    ENDPOINTActualizarEstadoNotasPagar,
    ENDPOINTListarNotasPagarPaginacion,
    ENDPOINTObtenerNoNotasPagarCredito,
    ENDPOINTObtenerNoNotasPagarCargo,
    ENDPOINTObtenerNoNotasPagarDevolucion,
    ENDPOINTTotalNotasPagar,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra pedidos de venta
export async function registraNotaPagar(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraNotaPagar, data, config);
}

export async function totalNotasPagar() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalNotasPagar, config);
}

// Para obtener todos los datos del pedido
export async function obtenerNotasPagar(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNotasPagar + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosNotaPagar(ordenVenta) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosNotasPagar + `/${ordenVenta}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroNotaPagarCredito(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoNotasPagarCredito, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroNotaPagarCargo(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoNotasPagarCargo, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroNotaPagarDevolucion(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoNotasPagarDevolucion, config);
}

// Para listar todos los pedidos
export async function listarNotasPagar(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarNotasPagar + `/?sucursal=${sucursal}`, config);
}

// Para listar todos los pedidos
export async function listarNotasPagarPorTipo(tipo, sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarNotasPagarPorTipo + `/?tipo=${tipo}&&sucursal=${sucursal}`, config);
}

// Para listar todos los pedidos
export async function listarNotasPagarActivas(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarNotasPagarActivas + `/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarNotasPagarPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarNotasPagarPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaNotasPagar(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarNotasPagar + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoNotasPagar(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoNotasPagar + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaNotasPagar(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarNotasPagar + `/${id}`, data, config);
}
