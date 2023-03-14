import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraCuentaProveedor,
    ENDPOINTListarCuentaProveedor,
    ENDPOINTListarCuentaProveedorActivo,
    ENDPOINTObtenerCuentaProveedor,
    ENDPOINTObtenerDatosCuentaProveedor,
    ENDPOINTEliminarCuentaProveedor,
    ENDPOINTActualizarCuentaProveedor,
    ENDPOINTActualizarEstadoCuentaProveedor,
    ENDPOINTListarCuentaProveedorPaginacion,
    ENDPOINTObtenerNoCuentaProveedor,
    ENDPOINTTotalCuentaProveedor,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra pedidos de venta
export async function registraCuentaProveedor(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraCuentaProveedor, data, config);
}

export async function totalCuentaProveedor() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalCuentaProveedor, config);
}

// Para obtener todos los datos del pedido
export async function obtenerCuentaProveedor(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerCuentaProveedor + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosCuentaProveedor(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosCuentaProveedor + `/${folio}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroCuentaProveedor(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoCuentaProveedor, config);
}

// Para listar todos los pedidos
export async function listarCuentaProveedor(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCuentaProveedor + `/?sucursal=${sucursal}`, config);
}

// Para listar todos los pedidos
export async function listarCuentaProveedorActiva(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCuentaProveedorActivo + `/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarCuentaProveedorPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCuentaProveedorPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaCuentaCliente(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarCuentaProveedor + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoCuentaProveedor(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoCuentaProveedor + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaCuentaProveedor(cliente, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarCuentaProveedor + `/${cliente}`, data, config);
}
