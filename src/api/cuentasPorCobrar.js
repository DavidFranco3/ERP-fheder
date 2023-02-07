import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraCuentasCobrar,
    ENDPOINTListarCuentasCobrar,
    ENDPOINTListarCuentasCobrarPorCliente,
    ENDPOINTListarCuentasCobrarActivo,
    ENDPOINTObtenerCuentasCobrar,
    ENDPOINTEliminarCuentasCobrar,
    ENDPOINTActualizarCuentasCobrar,
    ENDPOINTListarCuentasCobrarPaginacion,
    ENDPOINTObtenerNoCuentasCobrar,
    ENDPOINTActualizarEstadoCuentasCobrar,
    ENDPOINTObtenerDatosCuentasCobrar,
    ENDPOINTTotalCuentasCobrar
} from "./endpoints";
import axios from 'axios';
import {getTokenApi} from "./auth";

// Registra pedidos de venta
export async function registraCuentasCobrar(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraCuentasCobrar, data, config);
}

export async function totalCuentasCobrar() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalCuentasCobrar, config);
}

// Para obtener todos los datos del pedido
export async function obtenerCuentasCobrar(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerCuentasCobrar + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosCuentasCobrar(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosCuentasCobrar + `/${folio}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroCuentasCobrar(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoCuentasCobrar, config);
}

// Para listar todos los pedidos
export async function listarCuentasCobrar(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCuentasCobrar +`/?sucursal=${sucursal}`, config);
}

// Para listar todos los pedidos
export async function listarCuentasCobrarPorCliente(sucursal, cliente) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCuentasCobrarPorCliente +`/?sucursal=${sucursal}&&cliente=${cliente}`, config);
}

// Para listar todos los pedidos
export async function listarCuentasCobrarActiva(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCuentasCobrarActivo +`/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarCuentasCobrarPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCuentasCobrarPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaCuentasCobrar(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarCuentasCobrar + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoCuentasCobrar(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoCuentasCobrar + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaCuentasCobrar(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarCuentasCobrar + `/${id}`, data, config);
}
