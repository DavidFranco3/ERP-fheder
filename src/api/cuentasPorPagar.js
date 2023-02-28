import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraCuentasPagar,
    ENDPOINTListarCuentasPagar,
    ENDPOINTListarCuentasPagarPorProveedor,
    ENDPOINTListarCuentasPagarActivo,
    ENDPOINTObtenerCuentasPagar,
    ENDPOINTObtenerDatosCuentasPagar,
    ENDPOINTEliminarCuentasPagar,
    ENDPOINTActualizarCuentasPagar,
    ENDPOINTActualizarEstadoCuentasPagar,
    ENDPOINTListarCuentasPagarPaginacion,
    ENDPOINTObtenerNoCuentasPagar,
    ENDPOINTTotalCuentasPagar,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra pedidos de venta
export async function registraCuentasPagar(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraCuentasPagar, data, config);
}

export async function totalCuentasPagar() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalCuentasPagar, config);
}

// Para obtener todos los datos del pedido
export async function obtenerCuentasPagar(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerCuentasPagar + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosCuentasPagar(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosCuentasPagar + `/${folio}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroCuentasPagar(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoCuentasPagar, config);
}

// Para listar todos los pedidos
export async function listarCuentasPagar(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCuentasPagar + `/?sucursal=${sucursal}`, config);
}

// Para listar todos los pedidos
export async function listarCuentasPagarPorProveedor(sucursal, proveedor) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCuentasPagarPorProveedor + `/?sucursal=${sucursal}&&proveedor=${proveedor}`, config);
}

// Para listar todos los pedidos
export async function listarCuentasPagarActiva(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCuentasPagarActivo + `/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarCuentasPagarPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCuentasPagarPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaCuentasPagar(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarCuentasPagar + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoCuentasPagar(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoCuentasPagar + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaCuentasPagar(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarCuentasPagar + `/${id}`, data, config);
}
