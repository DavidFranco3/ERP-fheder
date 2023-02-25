import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraCuentaCliente,
    ENDPOINTListarCuentaCliente,
    ENDPOINTListarCuentaClienteActivo,
    ENDPOINTObtenerCuentaCliente,
    ENDPOINTObtenerDatosCuentaCliente,
    ENDPOINTEliminarCuentaCliente,
    ENDPOINTActualizarCuentaCliente,
    ENDPOINTActualizarEstadoCuentaCliente,
    ENDPOINTListarCuentaClientePaginacion,
    ENDPOINTObtenerNoCuentaCliente,
    ENDPOINTTotalCuentaCliente,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra pedidos de venta
export async function registraCuentaCliente(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraCuentaCliente, data, config);
}

export async function totalCuentaCliente() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalCuentaCliente, config);
}

// Para obtener todos los datos del pedido
export async function obtenerCuentaCliente(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerCuentaCliente + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosCuentaCliente(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosCuentaCliente + `/${folio}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroCuentaCliente(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoCuentaCliente, config);
}

// Para listar todos los pedidos
export async function listarCuentaCliente(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCuentaCliente + `/?sucursal=${sucursal}`, config);
}

// Para listar todos los pedidos
export async function listarCuentaClienteActiva(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCuentaClienteActivo + `/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarCuentaClientePaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCuentaClientePaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
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

    return await axios.delete(API_HOST + ENDPOINTEliminarCuentaCliente + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoCuentaCliente(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoCuentaCliente + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaCuentaCliente(cliente, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarCuentaCliente + `/${cliente}`, data, config);
}
